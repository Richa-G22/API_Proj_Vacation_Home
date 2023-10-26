fetch('/api/users', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `ukKBhYbn-ActC7v59hkrXkpboY_9OEzNEtwM`
    },
    body: JSON.stringify({
      email: 'hellostar@spider.man',
      firstName: 'kkkkkk',
      lastName: 'mmmmmmm',
      username: 'Hellostar',
      password: 'password'
    })
  }).then(res => res.json()).then(data => console.log(data));

  fetch('/api/session', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `q7Srl9m9--B78Zknlszkbq5OFUFyTfiNCMRI`
    },
    body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
  }).then(res => res.json()).then(data => console.log(data));

  //npx sequelize model:generate --name Spot --attributes 
  //ownerId:Integer,address:String,city:String,state:String,
  //country:String,lat:Decimal,lng:decimal,name:string,
  //description:string,price:decimal;

  //npx sequelize model:generate --name Booking --attributes 
  //spotId:integer,userId:integer,startDate:date,endDate:date;

  //npx sequelize model:generate --name ReviewImage --attributes
  //reviewId:integer,url:string;

  //npx sequelize model:generate --name Review --attributes
  //spotId:integer,userId:integer,review:string,stars:integer;

  //npx sequelize model:generate --name SpotImage --attributes
  //spotId:integer,url:string,preview:boolean;
