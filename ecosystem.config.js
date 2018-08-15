module.exports = {
  apps : [{
    name      : 'worth-dash',
    script    : 'server.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      key: '../hiro-keys/do_rsa',
      user: 'hiro',
      host: '159.89.221.108',
      ref: 'origin/master',
      repo: 'git@github.com:jdhiro/worth-dash.git',
      path: '/var/pm2-deploy/worth-dash',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
