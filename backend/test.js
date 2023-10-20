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