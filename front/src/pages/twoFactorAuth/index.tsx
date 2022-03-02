import "./style.scss"

export default function TwoFactorAuth() {

    return (
        <div className="d-flex align-items-center">
            <div className="container w-25 auth-card mt-5 p-3">
                <h1>Two factor auth</h1>
                <div className="p-3">
                    <img src="/assets/qrcode_test.png" alt="" className=""/>
                </div>
                <h3>Scan QRcode to continue authentication</h3>
            </div>
        </div>
    )

}