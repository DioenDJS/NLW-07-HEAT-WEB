import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {

    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {

    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function AuthProvider(props: AuthProvider) {

    const [ user, setUser ] = useState<User | null>(null);
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=c0cadc86e652a446c4b8`;

    async function signIn(githubCode: string){

        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const {token, user } = response.data;

        localStorage.setItem('@dowhile:token', token);

        console.log(user)

    }

    async function signOut(){
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect( () => {

        const token = localStorage.getItem('@dowhile:token');

        if(token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            })
        }

    }, []);
    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if(hasGithubCode) {

            //separando o codigo que vem pela url em url e code através do split
            const [ urlWithoutCode, githubCode ] = url.split('?code=');

            //tornando a url do navegador que esta visível para o usuario sem o code
            window.history.pushState({}, '', urlWithoutCode);
            
            signIn(githubCode)
        }
    }, [])

    return (
        <AuthContext.Provider value={{signInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    );
}

