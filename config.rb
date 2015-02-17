require 'slim'
Slim::Engine.disable_option_validator!

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
set :partials_dir, 'layouts'

set :frontmatter_extensions, %w(.html .slim)

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :relative_assets
  activate :asset_hash
end

# silence i18n warning
::I18n.config.enforce_available_locales = false
