import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../service/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserProps {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    user_type: string;
    created_at: string;
    updated_at: string;
}

export interface LoginProps {
    email: string;
    password: string;
}

export interface AuthStateProps {
    user: UserProps;
    token: string;
    refresh_token: string;
}

interface AuthContextData {
    user: UserProps;
    login: (val: LoginProps) => void;
    logout: () => void;
    loading: boolean;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

    const navigate = useNavigate()

    const [data, setData] = useState<AuthStateProps>({} as AuthStateProps);

    const [loading, setLoading] = useState(false);  
    
    async function loadStorageData(): Promise<void> {
        const user = localStorage.getItem('@user');
        const tokenn = localStorage.getItem('@token');
        const refresh = localStorage.getItem('@refresh_token');
    
        if (user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenn}`;
          setData({
            user: JSON.parse(user),
            token: JSON.stringify(tokenn ? tokenn : ''),
            refresh_token: JSON.stringify(refresh ? refresh : ''),
          });
        } else logout();
        setLoading(false);
      }


    const login = async ({ email, password }: LoginProps) => {
        setLoading(true)
        await api.post('', { email, password }).then(async (response) => {
            const { user, token, refresh_token } = response.data;
            setData({ user, token, refresh_token });

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            localStorage.setItem('@token', token)
            localStorage.setItem('@refresh_token', refresh_token)
            localStorage.setItem('@user', JSON.stringify(user))
            navigate('/home')
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao realizar login. Tente novamente')
        }).finally(() => setLoading(false))
    }

    const logout = async () => {
        localStorage.removeItem('@token')
        localStorage.removeItem('@refresh_token')
        localStorage.removeItem('@user')
        navigate('/')

        setData({} as AuthStateProps)
    }

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(logout);
        loadStorageData();
    
        return () => {
          subscribe();
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <AuthContext.Provider value={{
            user: data.user,
            login,
            logout,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };