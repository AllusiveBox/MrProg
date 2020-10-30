@echo off
cls
set /a counter=0
set /a restartcode=0

:Start

set /a counter=%counter%+1

d:

node index.js %restartcode%

set /a restartCode=%errorlevel%

IF %errorlevel%==0 (
	set /a counter=0
	GOTO :Start
)

IF %errorlevel%==88 (
	GOTO :Stop
)

IF %errorlevel%==99 (
	echo Pulling from Repo...
	git pull origin
)

if %counter%==10 (
	echo Failed to restart 10 times...
	GOTO :Stop

:Stop
echo Terminating...

EXIT /B