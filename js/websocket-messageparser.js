TypeCode = 
{
  Empty: 0,
  Object: 1,
  DBNull: 2,
  Boolean: 3,
  Char: 4,
  SByte: 5,
  Byte: 6,
  Int16: 7,
  UInt16: 8,
  Int32: 9,
  UInt32: 10,
  Int64: 11,
  UInt64: 12,
  Single: 13,
  Double: 14,
  Decimal: 15,
  DateTime: 16,
  String: 18,

  Array: 255
}

function WebSocketMessageParser(msg) {
  var br = new BinaryReader(msg);
  var result = [];
  
  var parse = function (pType){
    var pTypeCode = pType;
    if (!pTypeCode) {
      pTypeCode = br.readByte();
    }
    var length = 1;
    var res = 0;
    var resType = 0;
    var key;
    if (pTypeCode == TypeCode.Array) {
      res = [];
      resType = 1;
      length = br.readByte();
    } else if (pTypeCode == TypeCode.Object) {
      res = {};
      resType = 2;
      length = br.readByte();
    }
    for (var i = 0; i < length; i++) {
      var val = null;
      if (pTypeCode == TypeCode.Object) {
        typeCode = br.readByte();
        key = br.readString();
      }
      typeCode = br.readByte();
      switch (typeCode) {
        //case TypeCode.Empty:    // 0
        case TypeCode.Array:
          val = parse(typeCode);
          break;
        case TypeCode.Object:   // 1
          val = parse(typeCode);
          break;
        //case TypeCode.DBNull:   // 2
        case TypeCode.Boolean:  // 3
          val = br.readBool();
          break;
        case TypeCode.Char:     // 4
          val = br.readChar();
          break;
        case TypeCode.SByte:    // 5
          val = br.readSByte();
          break;
        case TypeCode.Byte:     // 6
          val = br.readByte();
          break;
        case TypeCode.Int16:    // 7
          val = br.readInt16();
          break;
        case TypeCode.UInt16:   // 8
          val = br.readUInt16();
          break;
        case TypeCode.Int32:    // 9
          val = br.readInt32();
          break;
        case TypeCode.UInt32:   // 10
          val = br.readUInt32();
          break;
          //case TypeCode.Int64:    // 11
          //case TypeCode.UInt64:   // 12
        case TypeCode.Single:   // 13
          val = br.readSingle();
          break;
        case TypeCode.Double:   // 14
          val = br.readDouble();
          break;
          //case TypeCode.Decimal:  // 15
          //case TypeCode.DateTime: // 16
        case TypeCode.String:   // 18
          val = br.readString();
          break;
      }
      if(resType === 0){
        res = val;
      } else if(resType === 1){
        res.push(val);
      } else if(resType === 2){
        res[key] = val;
      }
    }
    return res;
  }
  result = parse();
  return result;
}

function BinaryReader(buffer) {
  this.dv = new DataView(buffer);
  this.buffer = buffer;
  this.offset = 0;
}

BinaryReader.prototype.readBool = function () {
  var val = this.dv.getUint8(this.offset);
  val = !!val;
  this.offset++;
  return val;
}

BinaryReader.prototype.readChar = function () {
  var val = this.dv.getUint8(this.offset);
  var val = String.fromCharCode(val);
  this.offset ++;
  return val;
}

BinaryReader.prototype.readByte = function () {
  var val = this.dv.getUint8(this.offset);
  this.offset++;
  return val;
}

BinaryReader.prototype.readSByte = function () {
  var val = this.dv.getInt8(this.offset);
  this.offset++;
  return val;
}

BinaryReader.prototype.readInt16 = function(){
  var val = this.dv.getInt16(this.offset, true);
  this.offset += 2;
  return val; 
}

BinaryReader.prototype.readUInt16 = function () {
  var val = this.dv.getUint16(this.offset, true);
  this.offset += 2;
  return val;
}

BinaryReader.prototype.readInt32 = function(){
  var val = this.dv.getInt32(this.offset, true);
  this.offset += 4;
  return val; 
}

BinaryReader.prototype.readUInt32 = function () {
  var val = this.dv.getUint32(this.offset, true);
  this.offset += 4;
  return val;
}

BinaryReader.prototype.readSingle = function(){
  var val = this.dv.getFloat32(this.offset, true);
  this.offset += 4;
  return val;
}

BinaryReader.prototype.readDouble = function () {
  var val = this.dv.getFloat64(this.offset, true);
  this.offset += 8;
  return val;
}

BinaryReader.prototype.readString = function () {
  var byteCnt = this.dv.getUint8(this.offset);
  this.offset++;
  var str = '';
  if (byteCnt) {
    var val = new Uint8Array(this.buffer, this.offset, byteCnt);
    str = String.fromCharCode.apply(null, new Uint8Array(this.buffer, this.offset, byteCnt));
    this.offset += byteCnt;
  }
  return str;
}