# Example "flagful"
You can ignore the actual content that's being rendered here
```  
$ npm -g git+https://git@github.com/kshaa/interactive-template.git
$ interactive-template --variablesJs "./in/questions.json" --templateDir "./in/boilerplate" --outputDir "./out"
```

``` 
You'll answer some questions, then we'll copy './in/boilerplate' to './out' and embed your answers!
? './out' directory already exists should we override it? Yes
* Removing './out' *
Ok, lets start the questioning!
? Codename of the project [only lowercase symbols, please] sandbox
? Default AWS region code eu-west-2
? AWS profile code testaccount
Ok, we have the answers, I'll try to copy './in/boilerplate' to './out' and embed your answers now!
Well, seems like you're good to go, feel free to use './out' 
```

This example has already been run