module Jekyll
  module Paintings
    def painting(input)
      return File.join("/assets/images/", input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::Paintaings)
