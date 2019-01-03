module.exports = {
  apps: [{
    name: 'worth-dash',
    script: 'index.js',
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
      host: '68.183.169.226',
      ref: 'origin/master',
      ssh_options: "StrictHostKeyChecking=no",
      repo: 'git@github.com:jdhiro/worth-dash.git',
      path: '/var/pm2-deploy/worth-dash',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
