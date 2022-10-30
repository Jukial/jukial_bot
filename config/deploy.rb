# config valid for current version and patch releases of Capistrano
lock "~> 3.17.1"

set :application, "jukial_bot"
set :repo_url, "git@github.com:Jukial/jukial_bot.git"

set :branch, :master

set :deploy_to, "/home/jukial_bot"

set :linked_files, [".env"]

set :keep_releases, 5

set :npm_flags, "--silent --no-progress"

namespace :deploy do
  desc "Build app"
  task :build do
    on roles(:all) do
      within release_path do
        execute :npm, "run build --silent"
        execute :npm, "run typeorm migration:run --silent"
      end
    end
  end

  desc "Restart application"
  task :restart do
    on roles(:all) do
      within release_path do
        execute :npm, "run register --silent"
      end
      execute :pm2, :startOrRestart, fetch(:deploy_to) + '/shared/ecosystem.json', '--silent'
    end
  end

  before :publishing, :build
  after :publishing, :restart
end
