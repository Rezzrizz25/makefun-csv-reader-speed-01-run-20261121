// A faster drop-in for make.fun's own csv-reader 1.0.0.
//
// It answers exactly as csv-reader 1.0.0 does for every input {text, header}:
// the JSON value {columns, rows, errors}. The text is read once, left to
// right, with commas and double quotes. A U+FEFF at its very start is dropped.
// A record ends at LF or CRLF, and a line left with no characters is no
// record. Outside quotes a CR not followed by LF is dropped (stray_cr). A
// field that opens with a quote runs to the next quote that is not doubled,
// "" inside it one quote and each CRLF or lone CR inside it read as LF; what
// follows its closing quote, up to the next comma or line break, is appended
// as it stands (quote_junk, when the field ends); a quote that never closes
// is a literal character, and the text after it is read again as unquoted
// (unterminated_quote). A quote inside an unquoted field is a literal
// character. Fields stay strings, never trimmed or converted. columns is the
// first record when header is true, else null; rows holds the records after
// it (every record when header is false), each padded with empty strings
// (short_row, with fields: its field count) or cut (long_row, with extra: the
// cut fields) to the first record's width. Each error is {code, line, row},
// in the order met; line is the 1-based line its record starts on, counting
// every LF, CRLF and lone CR inside quotes, and row its record's index in
// rows, null for the header.
//
// Speed comes from never walking the text one character at a time: unquoted
// fields jump from delimiter to delimiter with native scans, quoted fields
// jump from quote to quote with indexOf, and a field's value is a slice of
// the text (joined only when a stray CR or a doubled quote splits it). The
// next CR and the next LF are kept as lazy cursors, found once per stretch
// instead of once per field. Only a quoted field that holds a line break
// takes the slow path, and it is the only one that needs its line breaks
// counted and its CRs turned into LFs. Pure: no clock, no randomness, no
// locale, nothing kept from one call to the next.

/** How the field just read ended: at a comma, at a line break, at the end. */
const COMMA = 0;
const BREAK = 1;
const END = 2;

/** csv-reader 1.0.0's answer for one case's input. */
export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const errors = [];
  const rows = [];
  let columns = null;
  let width = -1;

  const len = text.length;
  let pos = text.charCodeAt(0) === 0xfeff ? 1 : 0; // a U+FEFF at the very start is dropped
  let line = 1; // the line the next character is on

  // The record being read: the line it starts on, and the index in rows it takes (null: the header).
  let recordLine = 1;
  let recordRow = null;

  // The field just read: its value, how it ended, and how many characters were kept onto it.
  let fValue = '';
  let fEnd = END;
  let fAdded = 0;

  // Lazily kept positions of the next CR and the next LF at or after `pos`:
  // each is found once per stretch instead of once per field. A cursor at -1
  // means no more of that character; a cursor behind `pos` is refreshed from
  // `pos` (every refresh starts at or after the last one's start, so the
  // scans together cover the text once).
  let nextCr = text.indexOf('\r', pos);
  let nextNl = text.indexOf('\n', pos);

  function error(code) {
    errors.push({ code, line: recordLine, row: recordRow });
  }

  // Reads unquoted characters onto `start`, up to the next comma or line
  // break: a CR not followed by LF is dropped (stray_cr). Sets fValue,
  // fEnd and fAdded; `added` counts the characters kept, not `start`.
  // The next delimiter is the nearest of comma, LF and CR, the comma found
  // by one native indexOf and the line breaks read off the lazy cursors.
  function unquoted(start) {
    let value = start;
    let added = 0;
    let seg = pos; // the start of the piece not yet appended
    while (true) {
      if (nextNl !== -1 && nextNl < seg) nextNl = text.indexOf('\n', seg);
      if (nextCr !== -1 && nextCr < seg) nextCr = text.indexOf('\r', seg);
      let i = text.indexOf(',', seg);
      if (nextNl !== -1 && (i === -1 || nextNl < i)) i = nextNl;
      if (nextCr !== -1 && (i === -1 || nextCr < i)) i = nextCr;
      if (i === -1) {
        // No more delimiters: the rest of the text is the field.
        if (len > seg) {
          value += text.slice(seg, len);
          added += len - seg;
        }
        pos = len;
        fValue = value;
        fAdded = added;
        fEnd = END;
        return;
      }
      const c = text.charCodeAt(i);
      if (c === 44) {
        // A comma: the field ends, the record goes on.
        if (i > seg) {
          value += text.slice(seg, i);
          added += i - seg;
        }
        pos = i + 1;
        fValue = value;
        fAdded = added;
        fEnd = COMMA;
        return;
      }
      if (c === 10) {
        // An LF: the field ends, the record ends.
        if (i > seg) {
          value += text.slice(seg, i);
          added += i - seg;
        }
        pos = i + 1;
        line += 1;
        fValue = value;
        fAdded = added;
        fEnd = BREAK;
        return;
      }
      // A CR: a CRLF ends the record; a lone CR is dropped (stray_cr).
      if (text.charCodeAt(i + 1) === 10) {
        if (i > seg) {
          value += text.slice(seg, i);
          added += i - seg;
        }
        pos = i + 2;
        line += 1;
        fValue = value;
        fAdded = added;
        fEnd = BREAK;
        return;
      }
      error('stray_cr');
      if (i > seg) {
        value += text.slice(seg, i);
        added += i - seg;
      }
      pos = i + 1;
      seg = i + 1;
    }
  }

  // The value of a quoted field's content, [start, end): every doubled quote
  // is one quote, every CRLF or lone CR is one LF, and every LF, CRLF and
  // lone CR counts a line. Only called when the content holds a line break.
  function quotedSlow(start, end) {
    let out = '';
    let i = start;
    let seg = start;
    while (i < end) {
      const c = text.charCodeAt(i);
      if (c === 34) {
        // A doubled quote: any quote before `end` is one, the closing quote is at `end`.
        out += text.slice(seg, i);
        out += '"';
        i += 2;
        seg = i;
      } else if (c === 13) {
        // A CRLF or a lone CR inside quotes is one LF.
        out += text.slice(seg, i);
        out += '\n';
        line += 1;
        i += text.charCodeAt(i + 1) === 10 ? 2 : 1;
        seg = i;
      } else if (c === 10) {
        out += text.slice(seg, i);
        out += '\n';
        line += 1;
        i += 1;
        seg = i;
      } else {
        i += 1;
      }
    }
    return out + text.slice(seg, end);
  }

  // Reads a quoted field whose opening quote is at pos. Sets fValue, fEnd
  // and fAdded (fAdded is 0: the junk check reads it after the call).
  function quoted() {
    const open = pos;
    const openLine = line;
    let parts = null; // pieces before a doubled quote, each followed by one '"'
    let seg = open + 1; // the start of the piece not yet collected
    let p = open + 1;
    let q;
    while (true) {
      q = text.indexOf('"', p);
      if (q === -1) {
        // The quote never closes: it is a literal character, and the text
        // after it is read again as unquoted.
        pos = open + 1;
        line = openLine;
        error('unterminated_quote');
        unquoted('"');
        return;
      }
      if (text.charCodeAt(q + 1) === 34) {
        // A doubled quote inside the field is one quote.
        if (parts === null) parts = [];
        parts.push(text.slice(seg, q), '"');
        p = q + 2;
        seg = q + 2;
        continue;
      }
      break; // q is the closing quote
    }
    let value;
    if (nextNl !== -1 && nextNl < open + 1) nextNl = text.indexOf('\n', open + 1);
    if (nextCr !== -1 && nextCr < open + 1) nextCr = text.indexOf('\r', open + 1);
    if ((nextNl !== -1 && nextNl < q) || (nextCr !== -1 && nextCr < q)) {
      // The field holds a line break: count them and read each CR as LF.
      value = quotedSlow(open + 1, q);
    } else if (parts === null) {
      value = text.slice(open + 1, q);
    } else {
      parts.push(text.slice(seg, q));
      value = parts.join('');
    }
    pos = q + 1;
    if (pos >= len) {
      fValue = value;
      fEnd = END;
      fAdded = 0;
      return;
    }
    const c = text.charCodeAt(pos);
    if (c === 44) {
      pos += 1;
      fValue = value;
      fEnd = COMMA;
      fAdded = 0;
      return;
    }
    if (c === 10) {
      pos += 1;
      line += 1;
      fValue = value;
      fEnd = BREAK;
      fAdded = 0;
      return;
    }
    if (c === 13 && text.charCodeAt(pos + 1) === 10) {
      pos += 2;
      line += 1;
      fValue = value;
      fEnd = BREAK;
      fAdded = 0;
      return;
    }
    // What follows the closing quote is appended as it stands, up to the next comma or line break.
    unquoted(value);
    if (fAdded > 0) error('quote_junk');
  }

  while (true) {
    // Lines with no characters are no records.
    while (pos < len) {
      const c = text.charCodeAt(pos);
      if (c === 10) {
        pos += 1;
        line += 1;
      } else if (c === 13 && text.charCodeAt(pos + 1) === 10) {
        pos += 2;
        line += 1;
      } else {
        break;
      }
    }
    if (pos >= len) break;

    recordLine = line;
    recordRow = header && columns === null ? null : rows.length;
    const fields = [];
    let quotedLast = false;
    do {
      quotedLast = text.charCodeAt(pos) === 34;
      if (quotedLast) quoted();
      else unquoted('');
      fields.push(fValue);
    } while (fEnd === COMMA);

    // A line that held only stray CRs is left with no characters: no record (its stray_cr errors stay).
    if (fields.length === 1 && fields[0] === '' && !quotedLast) continue;

    if (width < 0) width = fields.length;
    if (header && columns === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      errors.push({ code: 'short_row', line: recordLine, row: recordRow, fields: fields.length });
      while (fields.length < width) fields.push('');
    } else if (fields.length > width) {
      errors.push({ code: 'long_row', line: recordLine, row: recordRow, extra: fields.splice(width) });
    }
    rows.push(fields);
  }
  return { columns: header ? (columns ?? []) : null, rows, errors };
}
