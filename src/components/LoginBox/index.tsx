import { useEffect } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { api } from '../../services/api';

import styles from './styles.module.scss';

type AuthResponse = {

    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function LoginBox(){
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=c0cadc86e652a446c4b8`;

    async function signIn(githubCode: string){

        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const {token, user } = response.data;

        localStorage.setItem('@dowhile:token', token);

        console.log(user)

    }

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
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com github
            </a>
        </div>
    )
}