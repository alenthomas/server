# Mongo

  - db: 'docDb'
  - collection: 'docs'
      - fields: 'username', 'type', 'file'

# Postgres

  - db: 'myDb'
  - table: 'users'
      - fields: 'username', 'password'
  - table: 'user<sub>details</sub>'
      - fields: 'user<sub>id</sub>', 'place'

# Mongo Import dump

  - mongoimport –db docDb –collection docs –file mongo.json