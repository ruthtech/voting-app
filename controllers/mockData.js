let mockUsers = [
    { name: "A. Smith", uuid: 1, district: "W01"},
    { name: "B. Smith", uuid: 2, district: "W02"},
    { name: "C. Smith", uuid: 3, district: "W02"},
    { name: "D. Smith", uuid: 4, district: "W01"},
    { name: "E. Smith", uuid: 5, district: "W02"},
    { name: "F. Smith", uuid: 6, district: "W03"},
    { name: "G. Smith", uuid: 7, district: "W01"},
    { name: "H. Smith", uuid: 8, district: "W02"},
    { name: "I. Smith", uuid: 9, district: "W03"},
    { name: "J. Smith", uuid: 10, district: "W02"},
    { name: "K. Smith", uuid: 11, district: "W02"},
    { name: "L. Smith", uuid: 12, district: "W02"}
];

let mockCandidates = [
  { name: "A. Scheer", pictureURL: "/candidate-pc-photo.jpg", party: "Conservative Party of Canada", district: "W01", id:"1234", phone: "1-800-100-1000", address: "1 Anywhere St", email: "scheer@pc.ca", twitter: "@scheer-pc", website: "http://scheer.pc.ca", party_website: "http://www.conservative.ca" },
  { name: "E. May", pictureURL: "/candidate-pc-photo.jpg", party: "Green Party of Canada", district: "W01", id:"2345", phone: "1-800-200-2000", address: "2 Anywhere St", email: "may@green.ca", twitter: "@may-green", website: "http://may.green.ca", party_website: "http://greenparty.ca" },
  { name: "J. Singh", pictureURL: "/candidate-pc-photo.jpg", party: "New Democrat Party", district: "W01", id:"3456", phone: "1-800-300-3000", address: "3 Anywhere St", email: "singh@ndp.ca", twitter: "@singh-ndp", website: "http://singh.ndp.ca", party_website: "http://www.ndp.ca" },
  { name: "Y. Blanchet", pictureURL: "/candidate-pc-photo.jpg", party: "Bloc Quebecois", district: "W01", id:"4567", phone: "1-800-400-41000", address: "4 Anywhere St", email: "blanchet@blocquebecois.org", twitter: "@blanchet-bloc", website: "http://blanchet.blocquebecois.org", party_website: "http://blocquebecois.org" },
  { name: "J. Trudeau", pictureURL: "/candidate-pc-photo.jpg", party: "Liberal Party of Canada", district: "W01", id:"5678", phone: "1-800-500-5000", address: "5 Anywhere St", email: "trudeau@liberal.ca", twitter: "@trudeau-liberal", website: "http://trudeau.liberal.ca", party_website: "http://www.liberal.ca" },

];

let mockDistricts = [
    {name: "W01", province: "Ontario"},
    {name: "W02", province: "British Columbia"},
    {name: "W03", province: "Nunavut"}
];

module.exports = {
    mockUsers: mockUsers,
    mockCandidates: mockCandidates,
    mockDistricts: mockDistricts
};

