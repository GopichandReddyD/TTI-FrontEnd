if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))  
{  
  $arguments = "& '" +$myinvocation.mycommand.definition + "'"
  Start-Process powershell -Verb runAs -ArgumentList $arguments
  Break
}
Write-Host "Building files" 
ng build
Write-Host "Deploying files...." 
Copy-Item "C:\Users\gdoggala\Documents\TTI-FrontEnd\dist\TTI-FrontEnd\*" "C:\inetpub\TTI\" -Recurse -Force
Write-Host "Files deployed"
