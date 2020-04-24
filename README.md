<div align="center">
  <br>
  <img
    alt="Marion colomer"
    src="./assets/images/birds/1.jpg"
    width="200"
  />
  <br/>
  <h1><a href="https://minecraft.telecomnancy.net" rel="nofollow noreferrer noopener" target="_blank">Marion Colomer's website</a></h1>
</div>
<br/>
<p align="center">
  <a href="https://www.ruby-lang.org/en/">
    <img src="https://img.shields.io/badge/Ruby-2.7.0-green.svg" alt="ruby version"/>
  </a>
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/Node-10.3.0-green.svg" alt="rails version"/>
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="prettier"/>
  </a>
  <a href="https://jekyllrb.com/">
    <img src="https://img.shields.io/badge/Powered%20By-Jekyll-blue" alt="jeyll"/>
  </a>
</p>

Website for the artist Marion Colomer. This project is developped with [Jekyll](https://jekyllrb.com/).

## Getting Started

### Prerequisites

- [Ruby](https://www.ruby-lang.org/en/): I recommend using [rvm](https://rvm.io/) to install the Ruby version listed on the badge.
- [Bundle](https://bundler.io/): the ruby gem dependency manger.
- [nodeJS](https://nodejs.org/): we recommend using [nvm](https://github.com/creationix/nvm) to install the nodeJS version listed on the badge. It's only useful if you want to use the [git hooks](https://github.com/typicode/husky).

### Standard Installation

1. Clone the repository, ie. `git clone https://github.com/Mcdostone/marion-colomer-website`
1. `bundle config set path vendor/bundle`
1. `bundle install`
1. `npm install`
1. `bundle exec jekyll serve`
1. You should be able to access the website: `http://localhost:4000/`

### Git hooks

When you run `git commit -m "my commit"`, a prehook is triggered: it will run `npm run lint`. If the linting is ok, the commit is created, else the commit is rejected, you have to fix linting before restart committing.

## Sniffing the old website

[Wayback Machine](https://archive.org/web/web.php) is your friend.

```bash
docker run --rm -it -v $PWD/websites:/websites hartator/wayback-machine-downloader http://marioncolomer.com
```

## Author

- Yann Prono, [@Mcdostone](https://github.com/Mcdostone)

## Extra

| Date       | Temps | Travail                                                                                                                               |
| :--------- | :---- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 16/12/2019 | 1h30  | Extraction du site via wayback machine, petite intro à gatsbyJS, recherche d'un theme plus en adéquation avec le travail de Marion.   |
| 09/01/2020 | 1h30  | je pars sur [Hugo](https://gohugo.io/), l'outil a l'air plus intéressant pour ce projet, écriture du `Makefile` pour tout automatiser |
| 09/01/2020 | 45min | Je commence à importer le texte de quelques pages                                                                                     |
| 10/01/2020 | 20min | fini l'import de texte                                                                                                                |
| 11/01/2020 | 10min | on lit de la doc sur le templating                                                                                                    |
| 13/01/2020 | 30min | Toujours sur l'apprentissage de Hugo                                                                                                  |
