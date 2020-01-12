import ottawaCentreDistrictBoundaries from './components/assets/geoJSON/ottawaCentreDistrictBoundaries';

const hannahWhite = { 
    "_id" : "5df12740d7c15a6378d6b8b5", 
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
        "district": "Ottawa Centre",
        "districtBoundaries": ottawaCentreDistrictBoundaries
    }, 
    "login" : {
        "username" : "sadmouse166", 
        "password" : "circle", 
    }, 
    "hasvoted" : false
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