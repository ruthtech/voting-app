import ottawaCentreDistrictBoundaries from './components/assets/geoJSON/ottawaCentreDistrictBoundaries';

const hannahWhite = { 
    _doc: {
      "_id" : "5df12740d7c15a6378d6b8b5", 
      "gender" : "female", 
      "name" : {
          "title" : "Ms", 
          "first" : "Hannah", 
          "last" : "White"
      }, 
      "location" : {
          "street" : {
              "number" : 1789, 
              "name" : "Grand Marais Ave"
          }, 
          "city" : "Edmonton", 
          "state" : "Alberta", 
          "country" : "Canada", 
          "postcode" : "T5H 0Z7", 
          "district" : "Edmonton Griesbach",
          "coordinates" : {
              "latitude" : 53.5533, 
              "longitude" : -113.4877
          }, 
          "timezone" : {
              "offset" : "-7:00", 
              "description" : "Edmonton"
          },
          "districtBoundaries": ottawaCentreDistrictBoundaries
      }, 
      "email" : "hannah.white@example.com", 
      "login" : {
          "uuid" : "3047a2a1-6bda-42b3-b519-8ecd288406de", 
          "username" : "sadmouse166", 
          "password" : "circle", 
          "salt" : "z14C7Za9", 
          "md5" : "8fd37f57b68a0f6d735e025197446b6c", 
          "sha1" : "1047eec0ccc8af1f0374837d7e048afd5f5085ab", 
          "sha256" : "16a01c6c6cd33933b96d99b8b7c9c21878eae00fd176c82049cb9357fb5e291e"
      }, 
      "dob" : {
          "date" : "1981-09-18T07:14:21.069Z", 
          "age" : 38
      }, 
      "registered" : {
          "date" : "2007-12-09T02:42:39.014Z", 
          "age" : 12
      }, 
      "phone" : "205-691-0535", 
      "cell" : "581-225-3702", 
      "id" : {
          "name" : "", 
          "value" : null
      }, 
      "picture" : {
          "large" : "https://randomuser.me/api/portraits/women/57.jpg", 
          "medium" : "https://randomuser.me/api/portraits/med/women/57.jpg", 
          "thumbnail" : "https://randomuser.me/api/portraits/thumb/women/57.jpg"
      }, 
      "nat" : "CA", 
      "hasvoted" : null
    }
  };

const ottawaCentreCandidatesList = [
    {
      _id: '5df6901ba4ba6864ca3fe1dc',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Marijuana Party',
      party_affiliation_french: 'Parti Marijuana',
      last_name: 'Akpata',
      first_name: 'John Andrew Omowole',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1dd',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'New Democratic Party',
      party_affiliation_french: 'Nouveau Parti d�mocratique',
      last_name: 'Dewar',
      first_name: 'Paul',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1de',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Libertarian Party of Canada',
      party_affiliation_french: 'Parti Libertarien du Canada',
      last_name: 'Harris',
      first_name: 'Dean T.',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1df',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Conservative Party of Canada',
      party_affiliation_french: 'Parti conservateur du Canada',
      last_name: 'Konstantinakos',
      first_name: 'Damian',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1e0',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Rhinoceros Party',
      party_affiliation_french: 'Parti Rhinoc�ros',
      last_name: 'Lukawski',
      first_name: 'Conrad',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1e1',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Liberal Party of Canada',
      party_affiliation_french: 'Parti lib�ral du Canada',
      last_name: 'McKenna',
      first_name: 'Catherine Mary',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1e2',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Green Party of Canada',
      party_affiliation_french: 'Le Parti Vert du Canada',
      last_name: 'Milroy',
      first_name: 'Tom',
      middle_initial: null,
      votes_for: null
    },
    {
      _id: '5df6901ba4ba6864ca3fe1e3',
      district_no: 35075,
      district_name: 'Ottawa Centre',
      district_name_french: 'Ottawa-Centre',
      party_affiliation: 'Communist Party of Canada',
      party_affiliation_french: 'Parti communiste du Canada',
      last_name: 'Ryan',
      first_name: 'Stuart',
      middle_initial: null,
      votes_for: null
    }
];

export { hannahWhite, ottawaCentreCandidatesList };
export default hannahWhite;