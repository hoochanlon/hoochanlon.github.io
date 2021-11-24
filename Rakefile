require 'rake'
require 'yaml'

SOURCE = "."
CONFIG = {
  'posts' => File.join(SOURCE, "_posts/#{Time.now().year()}"),
  'post_ext' => "md",
}

# Usage: rake post title="A Title"
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = File.join(CONFIG['posts'], "#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts "date: #{Time.now}"
    post.puts "author: hoochanlon"
     post.puts "category: []"
    post.puts "tags: []"
    post.puts "math: true"
    post.puts "mermaid: true"
    post.puts "image:"
  	post.puts " src:"
    post.puts "---"
  end
end # task :post