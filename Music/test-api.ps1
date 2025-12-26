# Test API endpoints for signup and login

Write-Host "Testing Signup Endpoint..." -ForegroundColor Yellow
try {
    $signupBody = @{
        email = "test@example.com"
        password = "test123"
        username = "testuser"
        role = "USER"
    } | ConvertTo-Json

    $signupResponse = Invoke-RestMethod -Uri "http://localhost:8085/user/signup" `
        -Method Post `
        -ContentType "application/json" `
        -Body $signupBody

    Write-Host "Signup Response:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Signup Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nTesting Login Endpoint..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8085/user/signin" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    Write-Host "Login Response:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Login Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

