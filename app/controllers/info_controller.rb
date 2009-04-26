class InfoController < ApplicationController

    def posts
        posts = Post.find(:all, :order => 'created_at DESC')
        render :text => posts.to_json
    end
end
