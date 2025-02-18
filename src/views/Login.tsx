import React, { useState } from "react";

import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import './Login.scss';
import { useLocation, useNavigate } from "react-router";

function LoginView() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const nextUrl = queryParams.get('next') || '/';

    const SignInWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("You must enter a username and password.")
        }

        await signInWithEmailAndPassword(
            auth,
            username,
            password
        ).then(() => {
            navigate(nextUrl);
        }).catch(err => {
            setError(err.message);
        });
    };

    const SignInWithGoogle = async () => {
        const providor = new GoogleAuthProvider();

        await signInWithPopup(auth, providor).then(async () => {
            navigate('/');
        }).catch(err => {
            setError(err.message);
        });
    };

    return (
        <div className="container d-flex justify-content-center vh-100 align-items-center">
            <div className="card col-12 col-md-6 col-lg-4">
                <div className="card-header bg-secondary">
                    <h1>Login</h1>
                </div>
                <div className="card-body">
                    {
                        error !== "" && (
                        <div className="alert alert-danger">
                            <p>{error}</p>
                        </div>
                    ) }
                    <label htmlFor="username">Username</label>
                    <input className="form-control" type="email" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input className="form-control" type="password" name="username" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="mb-4 btn btn-primary" onClick={SignInWithEmail}>Login</button>
                    <hr />
                    <button type="button" className="btn btn-outline-info" onClick={SignInWithGoogle}>Login with Google</button>
                </div>
            </div>
        </div>
    );
}

export default LoginView
