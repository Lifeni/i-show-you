.\node_modules\.bin\react-scripts.cmd build ;
Remove-Item -Path '..\..\server\public' -Recurse ;
Copy-Item -Path '.\build' -Recurse -Destination '..\..\server\public'