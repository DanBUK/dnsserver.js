// list of all possible resource record types [RFC5395][RFC1035]
exports.RR_TYPES = {
	'A': 1, // a host address [RFC1035]
	'NS': 2, // an authoritative name server [RFC1035]
	'MD': 3, // a mail destination (Obsolete - use MX) [RFC1035]
	'MF': 4, // a mail forwarder (Obsolete - use MX) [RFC1035]
	'CNAME': 5, // the canonical name for an alias [RFC1035]
	'SOA': 6, // marks the start of a zone of authority [RFC1035]
	'MB': 7, // a mailbox domain name (EXPERIMENTAL) [RFC1035]
	'MG': 8, // a mail group member (EXPERIMENTAL) [RFC1035]
	'MR': 9, // a mail rename domain name (EXPERIMENTAL) [RFC1035]
	'NULL': 10, // a null RR (EXPERIMENTAL) [RFC1035]
	'WKS': 11, // a well known service description (Obsolete - see RFC ) [RFC1035]
	'PTR': 12, // a domain name pointer [RFC1035]
	'HINFO': 13, // host information [RFC1035]
	'MINFO': 14, // mailbox or mail list information [RFC1035]
	'MX': 15, // mail exchange [RFC1035]
	'TXT': 16, // text strings [RFC1035]
	'RP': 17, // responsible party [RFC1183]
	'AFSDB': 18, // AFS Data Base location [RFC1183][RFC5864]
	'X25': 19, // X.25 PSDN address [RFC1183]
	'ISDN': 20, // ISDN address [RFC1183]
	'RT': 21, // Route Through [RFC1183]
	'NSAP': 22, // for NSAP address, NSAP style A record [RFC1706]
	'NSAP-PTR': 23, // for domain name pointer, NSAP style [RFC1348]
	'SIG': 24, // for security signature [RFC4034][RFC3755][RFC2535]
	'KEY': 25, // for security key [RFC4034][RFC3755][RFC2535]
	'PX': 26, // X.400 mail mapping information [RFC2163]
	'GPOS': 27, // Geographical Position [RFC1712]
	'AAAA': 28, // ipv6 version of a host address [RFC3596]
	'LOC': 29, // Location Information [RFC1876]
	'NXT': 30, // Next Domain (Obsolete) [RFC3755][RFC2535]
	'EID': 31, // Endpoint Identifier [Patton]
/*	
	These two are believed to not be in use. If they are, they conflict with NIMLOC and SRV below
	'NB': 32, // NetBIOS general Name Service [RFC1002]
    'NBSTAT': 33, // NetBIOS NODE STATUS [RFC1002]
*/
	'NIMLOC': 32, // Nimrod Locator [Patton]
	'SRV': 33, // Server Selection [RFC2782]
	'ATMA': 34, // ATM Address [ATMDOC]
	'NAPTR': 35, // Naming Authority Pointer [RFC2915][RFC2168][RFC3403]
	'KX': 36, // Key Exchanger [RFC2230]
	'CERT': 37, // [RFC4398]
	'A6': 38, // IPv6 A record (Experimental) [RFC3226][RFC2874]
	'DNAME': 39, // [RFC2672]
	'SINK': 40, // [Eastlake]
	'OPT': 41, // [RFC2671]
	'APL': 42, // [RFC3123]
	'DS': 43, // Delegation Signer [RFC4034][RFC3658]
	'SSHFP': 44, // SSH Key Fingerprint [RFC4255]
	'IPSECKEY': 45, // [RFC4025]
	'RRSIG': 46, // [RFC 4034][RFC3755]
	'NSEC': 47, // [RFC 4034][RFC3755]
	'DNSKEY': 48, // [RFC 4034][RFC3755]
	'DHCID': 49, // [RFC4701]
	'NSEC3': 50, // [RFC5155]
	'NSEC3PARAM': 51, // [RFC5155]
	'HIP': 55, // Host Identity Protocol [RFC5205]
	'NINFO': 56, // [Reid]
	'RKEY': 57, // [Reid]
	'TALINK': 58, // Trust Anchor LINK [Wijngaards]
	// 59-98 - Unassigned
	'SPF': 99, // [RFC4408]
	'UINFO': 100, // [IANA-Reserved]
	'UID': 101, // [IANA-Reserved]
	'GID': 102, // [IANA-Reserved]
	'UNSPEC': 103, // [IANA-Reserved]
	// 104-248 - Unassigned
	// 249-255 - QTypes defined below
	// 256-32767 - Unassigned
	'TA': 32768, // DNSSEC Trust Authorities [Weiler]
	'DLV': 32769, // DNSSEC Lookaside Validation [RFC4431]
	// 32770 - 65279 - Unassigned
	// 65280 - 65534 - Private use
	// 65535 - Reserved
};

// list of additional types which are valid in a question portion of a query [RFC5395][RFC1035]
exports.RR_QTYPES = exports.RR_TYPES;
exports.RR_QTYPES['TKEY'] = 249; // Transaction Key [RFC2930]
exports.RR_QTYPES['TSIG'] = 250; // Transaction Signature [RFC2845]
exports.RR_QTYPES['IXFR'] = 251; // incremental transfer [RFC1995]
exports.RR_QTYPES['AXFR'] = 252; // a request for a transfer of an entire zone [RFC1035][RFC5936]
exports.RR_QTYPES['MAILB'] = 253; // a request for mailbox-related records (MB, MG, or MR) [RFC1035]
exports.RR_QTYPES['MAILA'] = 254; // a request for mail agent RRs (Obsolete - see MX) [RFC1035]
exports.RR_QTYPES['*'] = 255; // a request for all records [RFC1035]
exports.RR_QTYPES['ANY'] = 255; // an alternate form of a request for all records [RFC1035]

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

// list of valid classes for query records [RFC5395]
exports.RR_CLASS = {
	'IN': 1, // the Internet [RFC1035]
	'CS': 2, // the CSNET class (Obsolete)
	'CH': 3, // the CHAOS class [Moon1981]
	'HS': 4 // Hesiod [Dyer1987]
	// 5-253 - Unassigned
	// 254-2544 - Defined in QCLASS below
	// 256-65279 - Unassigned
	// 65280-65534 - Private use [RFC5395]
	// 65535 - Reserved [RFC5395]
}

// list of additional classes which are valid in the question portion of a query [RFC5395]
exports.RR_QCLASS = exports.RR_CLASS;
exports.RR_QCLASS['NONE'] = 254; // as the name implies, no class [RFC2136]
exports.RR_QCLASS['ANY'] = 255; // an alternate form of a request for any class [RFC1035]
exports.RR_QCLASS['*'] = 255; // a request for any class [RFC1035]

exports.const2qclass = function(qclass_constant) {
	// only six possible cases here in common use, so using a switch statement
	switch(qclass_constant) {
		case 1: return 'IN';
		case 2: return 'CS';
		case 3: return 'CH';
		case 4: return 'HS';
		case 254: return 'NONE';
		case 255: return '*';
		default: return null;
	}
}

// list of valid response codes from the server [RFC5395][RFC1035]
exports.RCODE = {
	'NoError': 0, // no error condition, as the name implies [RFC1035]
	'FormErr': 1, // name server was unable to interpret the query [RFC1035]
	'ServFail': 2, // query processing failed due to a problem with the name server [RFC1035]
	'NXDomain': 3, // domain name references in the query doesn't exist [RFC1035]
	'NotImp': 4, // name server does not support the requested kind of query [RFC1035]
	'Refused': 5, // the name server refuses to perform the specified operation for policy reasons [RFC1035]
	'YXDomain': 6, // Name exists when it should not [RFC2136]
	'YXRRSet': 7, // RR Set exists when it should not [RFC2136]
	'NXRRSet': 8, // // RR Set that should exist does not [RFC2136]
	'NotAuth': 9, // Server not authoritative for zone [RFC2136]
	'NotZone': 10, // Name not contained in zone [RFC2136]
	'BADVERS': 16, // Bad OPT Version [RFC2671]
	'BADSIG': 16, // TSIG Signature failure [RFC2845]
	'BADKEY': 17, // Key not recognized [RFC2845]
	'BADTIME': 18, // Signature out of time window [RFC2845]
	'BADMODE': 19, // Bad TKEY mode [RFC2930]
	'BADNAME': 20, // Duplicate key name [RFC2930]
	'BADALG': 21, // Algorithm not supported [RFC2930]
	'BADTRUNC': 22 // Bad truncation [RFC4635]
}

// list of bit positions for each flag in the flag field of the DNS query header [RFC5395][RFC1035]
exports.QHFLAGS = {
	'AA': 5, // Authoritative Answer [RFC1035]
	'TC': 6, // Truncated Response [RFC1035]
	'RD': 7, // Recursion Desired [RFC1035]
	'RA': 8, // Recursion Allowed [RFC1035]
	'AD': 10, // Authenticated Data [RFC4035]
	'CD': 11 // Checking Disabled [RFC4035]
}

// list of valid DNS opcodes [RFC5395][RFC1035]
exports.OPCODES = {
	'Query': 0, // [RFC1035]
	'IQuery': 1, // (Obsolete) [RFC3425]
	'Status': 2, // [RFC1035]
	// 3 - Unassigned
	'Notify': 4, // [RFC1996]
	'Update': 5, // [RFC2136]
	// 6-15 - Unassigned
}