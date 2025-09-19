
export default function Home() {
  return (
    <div className="min-h-[95vh] flex items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Inbound Carrier Sales Automation
          </h1>
          <p className="text-xl text-muted-foreground">
            POC powered by HappyRobot
          </p>
        </div>

        <div className="space-y-4 text-left bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold text-foreground">Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Automated carrier MC number verification via FMCSA API</li>
            <li>• Load matching and rate negotiation handling</li>
            <li>• Real-time call sentiment analysis and outcome tracking</li>
            <li>• Comprehensive dashboard with booking metrics</li>
            <li>• Secure API endpoints with authentication</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
