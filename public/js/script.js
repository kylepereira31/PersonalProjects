document.addEventListener("DOMContentLoaded", () => {
    const posts = []; // Array to store post objects
    const postButton = document.getElementById("creating-post");
    const postText = document.getElementById("post-text");
    const usernameInput = document.getElementById("username");
    const displayPosts = document.getElementById("display-posts");
    const searchInput = document.getElementById("search-input");

    postButton.addEventListener("click", () => {
        const text = postText.value.trim();
        if (!text) {
            alert("Please enter text for your post.");
            return;
        }
        
        const username = usernameInput.value.trim() || "Anonymous";
        
        const post = {
            username,
            text,
            timestamp: new Date().toLocaleString(),
            likes: 0,
            replies: []
        };
        
        posts.push(post);
        renderPosts(posts);
        postText.value = "";
    });

    function displayPost(post) {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        
        postElement.innerHTML = `
            <h3><strong>${post.username}</strong> <span class="timestamp">(${post.timestamp})</span></h3>
            <p>${post.text}</p>
            <button class="like-button" style="background-color: #007bff; color: white;">Like (<span>${post.likes}</span>)</button>
            <button class="reply-button">Reply</button>
            <button class="delete-button" style="background-color: #dc3545; color: white;">Delete</button>
            <div class="replies"></div>
        `;

        const likeButton = postElement.querySelector(".like-button");
        const deleteButton = postElement.querySelector(".delete-button");
        const replyButton = postElement.querySelector(".reply-button");
        const repliesContainer = postElement.querySelector(".replies");

        likeButton.addEventListener("click", () => {
            post.likes++;
            likeButton.querySelector("span").textContent = post.likes;
        });

        deleteButton.addEventListener("click", () => {
            const index = posts.indexOf(post);
            if (index > -1) posts.splice(index, 1);
            renderPosts(posts);
        });

        replyButton.addEventListener("click", () => {
            const replyForm = document.createElement("div");
            replyForm.innerHTML = `
                <input type="text" class="reply-username" placeholder="Username (optional)"/>
                <input type="text" class="reply-text" placeholder="Reply..."/>
                <button class="submit-reply">Reply</button>
            `;

            replyButton.disabled = true;
            repliesContainer.appendChild(replyForm);

            const submitReplyButton = replyForm.querySelector(".submit-reply");
            submitReplyButton.addEventListener("click", () => {
                const replyUsername = replyForm.querySelector(".reply-username").value.trim() || "Anonymous";
                const replyText = replyForm.querySelector(".reply-text").value.trim();

                if (!replyText) {
                    alert("Please enter text for your reply.");
                    return;
                }

                const reply = {
                    username: replyUsername,
                    text: replyText,
                    timestamp: new Date().toLocaleString(),
                    likes: 0
                };

                post.replies.push(reply);
                displayReply(reply, repliesContainer);
                replyForm.remove();
                replyButton.disabled = false;
            });
        });

        post.replies.forEach(reply => displayReply(reply, repliesContainer));
        displayPosts.appendChild(postElement);
    }

    function displayReply(reply, container) {
        const replyElement = document.createElement("div");
        replyElement.classList.add("reply");
        replyElement.innerHTML = `
            <h4><strong>${reply.username}</strong> <span class="timestamp">(${reply.timestamp})</span></h4>
            <p>${reply.text}</p>
            <button class="like-button" style="background-color: #007bff; color: white;">Like (<span>${reply.likes}</span>)</button>
            <button class="delete-button" style="background-color: #dc3545; color: white;">Delete</button>
        `;

        const likeButton = replyElement.querySelector(".like-button");
        const deleteButton = replyElement.querySelector(".delete-button");

        likeButton.addEventListener("click", () => {
            reply.likes++;
            likeButton.querySelector("span").textContent = reply.likes;
        });

        deleteButton.addEventListener("click", () => {
            container.removeChild(replyElement);
        });

        container.appendChild(replyElement);
    }

    function renderPosts(postArray) {
        displayPosts.innerHTML = "";
        if (postArray.length === 0) {
            const searchTerm = searchInput.value.trim();
            const message = document.createElement("p");
            message.textContent = `No posts found with the term "${searchTerm}".`;
            displayPosts.appendChild(message);
        } else {
            postArray.forEach(displayPost);
        }
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            renderPosts(posts);
            return;
        }

        const filteredPosts = posts.filter(post => post.text.toLowerCase().includes(searchTerm));
        renderPosts(filteredPosts);
    });

    renderPosts(posts);
});
