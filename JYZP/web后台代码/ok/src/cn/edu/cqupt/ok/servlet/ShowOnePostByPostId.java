package cn.edu.cqupt.ok.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

import cn.edu.cqupt.ok.exception.PostException;
import cn.edu.cqupt.ok.po.Post;
import cn.edu.cqupt.ok.service.PostService;
import cn.edu.cqupt.ok.service.impl.PostServiceImpl;
import cn.edu.cqupt.ok.utils.JsonUtils;

@WebServlet("/ShowOnePostByPostId")
public class ShowOnePostByPostId extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonObject = JsonUtils.getJsonObject();
		if(request.getParameter("Post") != null) {
			Post post = JsonUtils.getEntity(request.getParameter("Post"), Post.class);
			PostService postService = new PostServiceImpl();
			try {
				Post _post = postService.showOnePostByPostId(post);
				if(_post == null) {
					jsonObject.addProperty("msg", "该条岗位信息失效");
					response.getWriter().write(jsonObject.toString());
				} else {
					response.getWriter().write(JsonUtils.EntityToJson(_post));
				}
			} catch(PostException e) {
				jsonObject.addProperty("msg", e.getMessage());
				response.getWriter().write(jsonObject.toString());
			}
		} else {
			jsonObject.addProperty("msg", "非法访问");
			response.getWriter().write(jsonObject.toString());
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
