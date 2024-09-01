import React from "react";

function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.querySelector(".login-username").value;
    const password = document.querySelector("#password-input").value;
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <section className="login-page">
      <div className="box">
        <div className="square" style={{ "--i": 0 }}></div>
        <div className="square" style={{ "--i": 1 }}></div>
        <div className="square" style={{ "--i": 2 }}></div>
        <div className="square" style={{ "--i": 3 }}></div>
        <div className="square" style={{ "--i": 4 }}></div>
        <div className="square" style={{ "--i": 5 }}></div>
        <div className="container">
          <div className="form">
            <h2>LOGIN</h2>
            <form onSubmit={handleLogin}>
              <div className="inputBx">
                <input type="text" required className="login-username" />
                <span>Username</span>
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="inputBx password">
                <input id="password-input" type="password" required />
                <span>Password</span>
                <div className="password-control"></div>
                <i className="fas fa-key"></i>
              </div>
              <label className="remember">
                <input type="checkbox" />
                Remember
              </label>
              <div className="inputBx">
                <input type="submit" value="Log in" />
              </div>
            </form>
            <p>
              Forgot password? <a href="#">Click Here</a>
            </p>
            <p>
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
