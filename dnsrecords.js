var lib = require('./lib');

// DnsRecords Store

var DnsRecords = function () {
  this.setup();
};

DnsRecords.prototype.setup = function () {
  this.records = {};
};

DnsRecords.prototype.setupRecordTree = function (domain, type) {
	if(!this.records.hasOwnProperty(domain)) {
		this.records[domain] = {};
	}
	if(!this.records[domain].hasOwnProperty(['in'])) {
		this.records[domain]['in'] = {};
	}
	if(!this.records[domain]['in'].hasOwnProperty(type)) {
		this.records[domain]['in'][type] = [];
	}
	
	return this.records[domain]['in'][type];
};

DnsRecords.prototype.addARecord = function (domain, ttl, data) {
	var leaf = this.setupRecordTree(domain, 'a');
	var ip = lib.ip2long(data);
	var rdata = lib.getZeroBuf(4);
	lib.numToBuffer(rdata, 0, ip, 4);
	leaf.push(lib.createRecord(lib.domainToQname(domain), 1, 1, ttl, rdata));
};

DnsRecords.prototype.addHackARecord = function (domain, qdomain, ttl, data) {
	var leaf = this.setupRecordTree(domain, 'a');
	var ip = lib.ip2long(data);
	var rdata = lib.getZeroBuf(4);
	lib.numToBuffer(rdata, 0, ip, 4);
	leaf.push(lib.createRecord(lib.domainToQname(qdomain), 1, 1, ttl, rdata));
}

DnsRecords.prototype.addSOARecord = function (domain, ttl, mname, rname, serial, refresh, retry, expire, minimum) {
	var leaf = this.setupRecordTree(domain, 'soa');
	
	mname = lib.domainToQname(mname);
	rname = lib.domainToQname(rname);
	
	var start = mname.length + rname.length;
	var rdata = lib.getZeroBuf(start + 4 + 4 + 4 + 4 + 4);
	
	mname.copy(rdata, 0, 0);
	rname.copy(rdata, mname.length, 0);
	
	lib.numToBuffer(rdata, start,      serial,  4);
	lib.numToBuffer(rdata, start + 4,  refresh, 4);
	lib.numToBuffer(rdata, start + 8,  retry,   4);
	lib.numToBuffer(rdata, start + 12, expire,  4);
	lib.numToBuffer(rdata, start + 16, minimum, 4);
	
	leaf.push(lib.createRecord(lib.domainToQname(domain), 1, 6, ttl, rdata));

};

DnsRecords.prototype.addMXRecord = function (domain, preference, host, ttl) {
	var leaf = this.setupRecordTree(domain, 'mx');
	var qname = lib.domainToQname(host);
	var rdata = lib.getZeroBuf(2 + qname.length);
	lib.numToBuffer(rdata, 0, preference, 2);
	qname.copy(rdata, 2, 0);
	
	leaf.push(lib.createRecord(lib.domainToQname(domain), 1, 15, ttl, rdata));
};

DnsRecords.prototype.addNSRecord = function (domain, host, ttl) {
	var leaf = this.setupRecordTree(domain, 'ns');
	var rdata = lib.domainToQname(host);
	leaf.push(lib.createRecord(lib.domainToQname(domain), 1, 2, ttl, rdata));
};

DnsRecords.prototype.addCNAMERecord = function (domain, host, ttl) {
	var leaf = this.setupRecordTree(domain, 'cname');
	var rdata = lib.domainToQname(host);
	leaf.push(lib.createRecord(lib.domainToQname(domain), 1, 5, ttl, rdata));
};

DnsRecords.prototype.findRecords = function(qname, qtype, qclass) {
    
    //assuming we are always going to get internet 
    //request but adding basic qclass support
    //for completeness 
    //TODO replace throws with error responses
    if (qclass === undefined || qclass === 1) {
        qclass = 'in';
    } else {
        throw new Error('Only internet class records supported');
    }
    
    switch(qtype.toString('binary').charCodeAt(1)) {
        case 1:
            qtype = 'a'; //a host address
            break;
        case 2:
            qtype = 'ns'; //an authoritative name server
            break;
        case 3:
            qtype = 'md'; //a mail destination (Obsolete - use MX)
            break;
        case 4:
            qtype = 'mf'; //a mail forwarder (Obsolete - use MX)
            break;
        case 5:
            qtype = 'cname'; //the canonical name for an alias
            break;
        case 6:
            qtype = 'soa'; //marks the start of a zone of authority
            break;
        case 7:
            qtype = 'mb'; //a mailbox domain name (EXPERIMENTAL)
            break;
        case 8:
            qtype = 'mg'; //a mail group member (EXPERIMENTAL)
            break;
        case 9:
            qtype = 'mr'; //a mail rename domain name (EXPERIMENTAL)
            break;
        case 10:
            qtype = 'null'; //a null RR (EXPERIMENTAL)
            break;
        case 11:
            qtype = 'wks'; //a well known service description (Deprecated in RFC 1123)
            break;
        case 12:
            qtype = 'ptr'; //a domain name pointer
            break;
        case 13:
            qtype = 'hinfo'; //host information
            break;
        case 14:
            qtype = 'minfo'; //mailbox or mail list information
            break;
        case 15:
            qtype = 'mx'; //mail exchange
            break;
        case 16:
            qtype = 'txt'; //text strings
            break;
    		case 17:
    			  qtype = 'rp'; // responsible party
    			  break;
        case 255:
            qtype = '*'; //select all types
            break;
        default:
//      			console.log("Didn't find: " + qtype);
            throw new Error('No valid type specified');
            break;
    }

    var domain = lib.qnameToDomain(qname);        
    
    var rr = [];
    if (this.records.hasOwnProperty(domain) && this.records[domain].hasOwnProperty(qclass)) {
      if (qtype === '*') {
        for(var qtype in this.records[domain][qclass]) {
		  	  rr = rr.concat(this.records[domain][qclass][qtype]);
		    }
      } else {
        if (this.records[domain][qclass].hasOwnProperty(qtype)) {
          var rr = this.records[domain][qclass][qtype];
        }
      }
    }
    
    return rr;
};
exports.DnsRecords = DnsRecords;