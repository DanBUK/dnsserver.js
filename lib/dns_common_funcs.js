exports.encodeDomainNameToLabel = function(domain) {
	var labels = domain.split(".");
    var len = domain.length + 2;

    var labelSeries = new Buffer(len);
    var offset = 0;

    for(var i=0; i<labels.length;i++) {
        labelSeries[offset]=labels[i].length;
        offset++;
        for(var j=0;j<labels[i].length;j++) {
            labelSeries[offset] = labels[i].charCodeAt(j);
            offset++;
        }
    }

    labelSeries[offset] = 0;

    return labelSeries;
};

exports.encodeCharacterStringToLabel = function(string) {
	// <character-string> isn't ^@ terminated like <domain-name> is
	var label = new Buffer(string.length + 1);
	
	label[0] = string.length;
	
	for(var i=0;i<string.length;i++) {
        label[i+1] = string.charCodeAt(i);
    }

	return label;
};

exports.ip2long = function(ip) {
    var ipsegments = ip.split('.');
	var iplong = 0;
	for(i=0;i<4;i++) {
		iplong += ipsegments[i] * Math.pow(256,3-i);
	}
	return iplong;
};

exports.getZeroFilledBuffer = function(len) {
    var buffer = new Buffer(len);
    for(var i=0;i<buffer.length;i++) { buffer[i]=0;}
    return buffer;
};

exports.pack = {
	'uint16': function (buffer, offset, number) {
        return exports.pack.uintX(buffer, offset, number, 2);
    },
    'uint32': function (buffer, offset, number) {
        return exports.pack.uintX(buffer, offset, number, 4);
    },
    'uint64': function (buffer, offset, number) {
        return exports.pack.uintX(buffer, offset, number, 8);
    },
	'uintX': function (buffer, offset, number, len) {
		for(var i=offset;i<offset+len;i++) {
	    	var shift = 8 * ((len - 1) - (i - offset));

	        buffer[i] = (number >> shift) & 255;
	    }

	    return buffer;
	}
};

exports.unpack = {
	'uint16': function(buffer, offset) {
        return ((buffer[offset] * 256) + buffer[offset + 1]);
    },
    'uint32': function(buffer, offset) {
        return (
            (buffer[offset] * 16777216) + 
            (buffer[offset + 1] * 65536) +
            (buffer[offset + 2] * 256) + 
            buffer[offset + 3]
        );
    },
    'uint64': function(buffer, offset) {
        return (
            (buffer[offset] * 72057594037927936) +
            (buffer[offset + 1] * 281474976710656) +
            (buffer[offset + 2] * 1099511627776) +
            (buffer[offset + 3] * 4294967296) +
            (buffer[offset + 4] * 16777216) +
            (buffer[offset + 5] * 65536) +
            (buffer[offset + 6] * 256) +
            buffer[offset + 7]
        );
    },
};