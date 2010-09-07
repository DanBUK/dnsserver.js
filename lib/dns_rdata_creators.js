var dnsCommon = require("dns_common_funcs");

exports.RDATACreator = {};

// TODO: Decide if I want the factory style or the direct access approach

exports.RDATACreator.get = function(type) {
	if(typeof exports.RDATACreator[type] == "function") {
		return exports.RDATACreator[type];
	}
}

// Helper functions to create the RDATA for each of the supported types

exports.RDATACreator.A = function(ip) {
	var iplong = ip;
	
	if(typeof ip !== "number") {
		var iplong = dnsCommon.ip2long(ip);
	}
	
	var rdata = dnsCommon.getZeroFilledBuffer(4);
	dnsCommon.pack.uint32(rdata, 0, iplong);
	
	return rdata;
};

exports.RDATACreator.NS = function(host) {
	return dnsCommon.encodeDomainNameToLabel(host);
};

exports.RDATACreator.CNAME = function(target) {
	return dnsCommon.encodeDomainNameToLabel(target);
};

exports.RDATACreator.SOA = function(mname, rname, serial, refresh, retry, expire, minimum) {
	var mnameLabelized = dnsCommon.encodeDomainNameToLabel(mname);
	var rnameLabelized = dnsCommon.encodeDomainNameToLabel(rname);
	
	var start = mnameLabelized.length + rnameLabelized.length;
	var rdata = dnsCommon.getZeroFilledBuffer(start + 4 + 4 + 4 + 4 + 4);
	
	mnameLabelized.copy(rdata, 0, 0);
	rnameLabelized.copy(rdata, mnameLabelized.length, 0);
	
	dnsCommon.pack.uint32(rdata, start, serial);
	dnsCommon.pack.uint32(rdata, start+4, refresh);
	dnsCommon.pack.uint32(rdata, start+8, retry);
	dnsCommon.pack.uint32(rdata, start+12, expire);
	dnsCommon.pack.uint32(rdata, start+16, minimum);
	
	return rdata;
};

exports.RDATACreator.PTR = function(host) {
	return dnsCommon.encodeDomainNameToLabel(host);
};

exports.RDATACreator.HINFO = function(cpu, os) {
	var cpuLabelized = dnsCommon.encodeCharacterStringToLabel(cpu);
	var osLabelized = dnsCommon.encodeCharacterStringToLabel(os);
	
	var rdata = dnsCommon.getZeroFilledBuffer(cpuLabelized.length + osLabelized.length);
	
	cpuLabelized.copy(rdata, 0, 0);
	osLabelized.copy(rdata, cpuLabelized.length, 0);
	
	return rdata;
};

exports.RDATACreator.MINFO = function(rmailbx, emailbx) {
	var rmailbxLabelized = dnsCommon.encodeDomainNameToLabel(rmailbx);
	var emailbxLabelized = dnsCommon.encodeDomainNameToLabel(emailbx);
	
	var rdata = dnsCommon.getZeroFilledBuffer(rmailbxLabelized.length + emailbxLabelized.length);
	
	rmailbxLabelized.copy(rdata, 0, 0);
	emailbxLabelized.copy(rdata, rmailbxLabelized.length, 0);
	
	return rdata;
};

exports.RDATACreator.MX = function(host, preference) {
	if(typeof preference !== "number") {
		preference = 10;
	}
	
	var qname = nsCommon.encodeDomainNameToLabel(host);
	var rdata = dnsCommon.getZeroFilledBuffer(2 + qname.length);
	
	dnsCommon.pack.uint16(rdata, 0, preference);
	
	qname.copy(rdata, 2, 0);
	
	return rdata;
};

exports.RDATACreator.TXT = function() {
	
};

exports.RDATACreator.RP = function() {
	
};

exports.RDATACreator.AAAA = function() {
	
};

exports.RDATACreator.SRV = function() {
	
};