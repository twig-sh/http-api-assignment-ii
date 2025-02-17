const response = (req, res, status, object) => {
  const content = JSON.stringify(object);

  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf-8'),
  });

  res.write(content);
  res.end();
};

const users = {};

const getUsers = (req, res) => {
  const object = {
    users,
  };

  response(req, res, 200, object);
};

const addUser = (req, res) => {
  const object = {
    message: 'Name and age are both required',
    id: 'addUserMissingParams',
  };

  const { name, age } = req.body;

  if (!name || !age) {
    response.id = 'missingParams';
    return response(req, res, 400, object);
  }

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

  if (responseCode === 201) {
    object.message = 'Created Successfully';
    return response(req, res, responseCode, object);
  }

  return response(req, res, responseCode, {});
};

const notFound = (req, res) => {
  const object = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  response(req, res, 404, object);
};

module.exports = {
  getUsers,
  addUser,
  notFound,
};
