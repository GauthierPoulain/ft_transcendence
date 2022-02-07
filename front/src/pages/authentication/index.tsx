import { useEffect, useMemo } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { apiurl, BaseResource } from "../../api/resources/BaseResource";
import { useAuth } from "../../auth";
import "./style.css";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

// TODO: Show an alert when a connection failure happens.

export function Page() {
    const query = useQuery();
    const code = query.get("code");
    const navigate = useNavigate();
    const isLoading = !!code;
    const auth = useAuth();

    useEffect(() => {
        const login = async (code: string) => {
            const token = await auth.exchangeCode(code);

            auth.signin(token);
            navigate("/", { replace: true });
        };

        if (isLoading) {
            login(code).catch(console.error.bind(console));
        }
    }, []);

    const fake_login = (name: string) => async () => {
        const response = await fetch(apiurl(`auth/fake_login_${name}`), {
            method: "POST",
        });
        const { token } = await response.json();

        auth.signin(token);
        navigate("/", { replace: true });
    };

    return (
        <Container>
            <div className="authContainer">
                <h1>Authentication</h1>


                <p>You will be redirected to the 42 intranet.</p>

                <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={isLoading ? null : auth.redirectIntra}
                >
                    {isLoading ? "Loading..." : "Sign in"}
                </Button>

                <Button
                    variant="secondary"
                    disabled={isLoading}
                    onClick={fake_login("one")}
                >
                    Fake login one
                </Button>

                <Button
                    variant="secondary"
                    disabled={isLoading}
                    onClick={fake_login("two")}
                >
                    Fake login two
                </Button>
            </div>
        </Container>
    );
}

//<img src="/assets/42.jpg" alt="" className="authImg" />