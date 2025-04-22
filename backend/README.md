# Laravel Language Matching API with Basic Authentification


## Requirements

- Laravel
- Composer
- Postman / Insomnia
- MySQL
- Version Control (Git)



## Authentification


#### To Register
- To Register : POST api/users/register

#### Connexion
- Connexion : POST api/users/login

#### Get connected User informations
- Connected User : GET api/user



## Language Matching


#### Create Tranlation
- Create new Translation : POST api/translations

#### Get Translations
- Get all Translations : GET api/translations
- Get Translations by language : GET api/translations/{source_lang}/{target_lang}               