// list of all possible resource record types
exports.RR_TYPES = {
	'A': 1, // a host address
	'NS': 2, // an authoritative name server
	'MD': 3, // a mail destination (Obsolete - use MX)
	'MF': 4, // a mail forwarder (Obsolete - use MX)
	'CNAME': 5, // the canonical name for an alias
	'SOA': 6, // marks the start of a zone of authority
	'MB': 7, // a mailbox domain name (EXPERIMENTAL)
	'MG': 8, // a mail group member (EXPERIMENTAL)
	'MR': 9, // a mail rename domain name (EXPERIMENTAL)
	'NULL': 10, // a null RR (EXPERIMENTAL)
	'WKS': 11, // a well known service description (Obsolete - see RFC )
	'PTR': 12, // a domain name pointer
	'HINFO': 13, // host information
	'MINFO': 14, // mailbox or mail list information
	'MX': 15, // mail exchange
	'TXT': 16, // text strings
	'RP': 17 // responsible party
};

// TODO Find out if node.js has any built in merge/unlink stuff

// list of additional types which are valid in a question portion of a query
exports.RR_QTYPES = exports.RR_TYPES;
exports.RR_QTYPES['AXFR'] = 252; // a request for a transfer of an entire zone
exports.RR_QTYPES['MAILB'] = 253; // a request for mailbox-related records (MB, MG, or MR)
exports.RR_QTYPES['MAILA'] = 254; // a request for mail agent RRs (Obsolete - see MX)
exports.RR_QTYPES['*'] = 255; // a request for all records
exports.RR_QTYPES['ANY'] = 255; // an alternate form of a request for all records

exports.const2qtype = function(qtype_constant) {
	// using a for..in loop as there's too many constants to cleanly list here
	// short circuiting for 255 as there are two matching types because of the alternate form
	if(qtype_constant === 255) return '*';
	for(var qtype in exports.RR_QTYPES) {
		if(exports.RR_QTYPES[qtype] === qtype_constant) {
			return qtype;
		} 
	}
	return null;
}

// list of valid classes for query records
exports.RR_CLASS = {
	'IN': 1, // the Internet
	'CS': 2, // the CSNET class (Obsolete)
	'CH': 3, // the CHAOS class
	'HS': 4 // Hesiod [Dyer 87]
}

// list of additional classes which are valid in the question portion of a query
exports.RR_QCLASS = exports.RR_CLASS;
exports.RR_QCLASS['ANY'] = 255; // an alternate form of a request for any class
exports.RR_QCLASS['*'] = 255; // a request for any class

exports.const2qclass = function(qclass_constant) {
	// only five possible cases here, so using a switch statement
	switch(qclass_constant) {
		case 1: return 'IN';
		case 2: return 'CS';
		case 3: return 'CH';
		case 4: return 'HS';
		case 255: return '*';
		default: return null;
	}
}

// list of valid response codes from the server
exports.RCODE = {
	'SUCCESS': 0, // no error condition, as the name implies
	'FORMAT_ERROR': 1, // name server was unable to interpret the query
	'SERVER_FAILURE': 2, // query processing failed due to a problem with the name server
	'NAME_ERROR': 3, // domain name references in the query doesn't exist
	'NOT_IMPLEMENTED': 4, // name server does not support the requested kind of query
	'REFUSED': 5 // the name server refuses to perform the specified operation for policy reasons
}