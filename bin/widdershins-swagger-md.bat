@echo off
setlocal

if "%~1"=="" (
    echo Usage: %~nx0 ^<openapi-file.yaml^>
    exit /b 1
)

set "INPUT=%~1"
set "OUTPUT=%~dpn1.md"

widdershins2 "%INPUT%" -o "%OUTPUT%" ^
    --headings=2 ^
    --expandBody=true ^
    --cleanMarkdown=true ^
    --omitBody=true ^
    --language_tabs=http ^
    --language_tabs=shell

echo Generated: "%OUTPUT%"
