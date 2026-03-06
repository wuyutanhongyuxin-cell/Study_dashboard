const OLE_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const GIF87_SIGNATURE = Buffer.from('GIF87a', 'ascii');
const GIF89_SIGNATURE = Buffer.from('GIF89a', 'ascii');
const JPG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const PDF_SIGNATURE = Buffer.from('%PDF-', 'ascii');
const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const RAR_SIGNATURE = Buffer.from([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]);
const SEVEN_Z_SIGNATURE = Buffer.from([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]);
const GZIP_SIGNATURE = Buffer.from([0x1f, 0x8b]);
const RIFF_SIGNATURE = Buffer.from('RIFF', 'ascii');
const WEBP_SIGNATURE = Buffer.from('WEBP', 'ascii');
const WAVE_SIGNATURE = Buffer.from('WAVE', 'ascii');
const ID3_SIGNATURE = Buffer.from('ID3', 'ascii');
const USTAR_SIGNATURE = Buffer.from('ustar', 'ascii');
const FTYP_SIGNATURE = Buffer.from('ftyp', 'ascii');

export function matchesExpectedSignature(fileExt: string, header: Buffer) {
  switch (fileExt) {
    case 'pdf':
      return header.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE);
    case 'png':
      return header.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
    case 'jpg':
    case 'jpeg':
      return header.subarray(0, JPG_SIGNATURE.length).equals(JPG_SIGNATURE);
    case 'gif':
      return header.subarray(0, GIF87_SIGNATURE.length).equals(GIF87_SIGNATURE)
        || header.subarray(0, GIF89_SIGNATURE.length).equals(GIF89_SIGNATURE);
    case 'webp':
      return header.subarray(0, RIFF_SIGNATURE.length).equals(RIFF_SIGNATURE)
        && header.subarray(8, 12).equals(WEBP_SIGNATURE);
    case 'doc':
    case 'xls':
    case 'ppt':
      return header.subarray(0, OLE_SIGNATURE.length).equals(OLE_SIGNATURE);
    case 'docx':
    case 'xlsx':
    case 'pptx':
    case 'zip':
      return header.subarray(0, ZIP_SIGNATURE.length).equals(ZIP_SIGNATURE);
    case 'rar':
      return header.subarray(0, RAR_SIGNATURE.length).equals(RAR_SIGNATURE);
    case '7z':
      return header.subarray(0, SEVEN_Z_SIGNATURE.length).equals(SEVEN_Z_SIGNATURE);
    case 'gz':
      return header.subarray(0, GZIP_SIGNATURE.length).equals(GZIP_SIGNATURE);
    case 'tar':
      return header.subarray(257, 257 + USTAR_SIGNATURE.length).equals(USTAR_SIGNATURE);
    case 'mp4':
      return header.subarray(4, 8).equals(FTYP_SIGNATURE);
    case 'mp3':
      return header.subarray(0, ID3_SIGNATURE.length).equals(ID3_SIGNATURE)
        || (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
    case 'wav':
      return header.subarray(0, RIFF_SIGNATURE.length).equals(RIFF_SIGNATURE)
        && header.subarray(8, 12).equals(WAVE_SIGNATURE);
    case 'txt':
    case 'md':
    case 'csv':
    case 'json':
      return !header.includes(0);
    default:
      return false;
  }
}
