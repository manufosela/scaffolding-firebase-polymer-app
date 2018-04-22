//
//    FICHEROS:
//        index.html : My App -> title
//        manifest.json : My App -> title
//        bower.json : My App -> title, @autor -> author
//        my-app.html : 
//            String myApp -> title ??
//            ----> my-view1.html, my-view2.html", my-view3.html -> prefix + sections + .html
//            ----> name="view1",name="view2",name="view3" -> sectionsName
//            ----> href="view1",href="view2",href="view3" -> sectionsName
//            ----> VIew One, View Two, View Three -> sectionsTitle
//            ----> <my-view1 <my-view2 <my-view3 -> prefix + sections
//            ----> </my-view1> </my-view2> </my-view3> -> prefix + sections
//            ----> this.page = page || 'view1' -> this.page = page || '[    section-one   ]';
//            ----> "my-" - prefix
//            ----> window.customElements.define(MyApp.is, MyApp); -> window.customElements.define([  Class   ].is, [   Class  ]);
//        my-view1.htnl:
//            my-view1 -> prefix-sections[0]
//            MyView1 -> classNmae[0]
//        
//

var fs = require('fs');

var configJSONFile = process.argv[2] || 'config.app.json';

var config = JSON.parse(fs.readFileSync(configJSONFile, 'utf8'));

var dir1 = 'CHANGES';
var dir2 = 'CHANGES/src';
if (!fs.existsSync(dir1)){ fs.mkdirSync(dir1); }
if (!fs.existsSync(dir2)){ fs.mkdirSync(dir2); }

var indexHtml = fs.readFileSync('index.html','utf8');
var manifest = fs.readFileSync('manifest.json','utf8');
var bower = fs.readFileSync('bower.json','utf8');
var myApp =  fs.readFileSync('src/my-app.html','utf8');
var myView = fs.readFileSync('src/my-view1.html', 'utf8');

indexHtml = indexHtml.replace(/My App/g, config.title);
manifest = manifest.replace(/My App/g, config.title);
bower = bower.replace(/My App/g, config.title);
bower = bower.replace(/\@autor/g, config.autor);
myApp = myApp.replace(/<my-view1/, '-VIEWS-<my-view1');
myApp = myApp.replace(/<my-view[0-9] name="view[0-9]"><\/my-view[0-9]>/g,'');
myApp = myApp.replace(/<a name="view1"/, '-REFS-<a name="view1"');
myApp = myApp.replace(/<a name="view[0-9]" href="\[\[rootPath\]\]view[0-9]">View\s[A-Za-z]*<\/a>/g, '');
myApp = myApp.replace(/<link rel="lazy-import" href="my-view1/, '-LAZY-<link rel="lazy-import" href="my-view1');
myApp = myApp.replace(/<link rel="lazy-import" href="my-view[0-9].html">/g, '');
myApp = myApp.replace(/My App/g, config.title);
var views = '\n';
var refs = '\n';
var lazy = '\n';
for(var i=0; i<config.sections.length; i++) {
    views += '\t\t<'+config.prefix+config.sections[i]+' name="'+config.sections[i]+'"></'+config.prefix+config.sections[i]+'>\n';
    refs += '\t\t<a name="'+config.sections[i]+'" href="[[rootPath]]'+config.sections[i]+'">'+config.sectionsName[i]+'<\/a>\n';
    lazy += '<link rel="lazy-import" href="'+config.prefix+config.sections[i]+'.html">\n';
}
myApp = myApp.replace(/-VIEWS-/, views);
myApp = myApp.replace(/-REFS-/, refs);
myApp = myApp.replace(/-LAZY-/, lazy);

for(var i=0; i<config.sections.length; i++) {
    myApp = myApp.replace(/my-view[0-9].html/,config.prefix+config.sections[0]+'.html');
}

myApp = myApp.replace(/this\.page = page \|\| 'view1';/, "this.page = page || '" + config.sections[0]+"';");
myApp = myApp.replace(/this\.resolveUrl\('my-' \+ page \+ '\.html'\);/, "this.resolveUrl('"+config.prefix+"' + page + '.html');");

//console.log(indexHtml);
fs.writeFile('./CHANGES/index.html', indexHtml, 'utf-8', function() { console.log('index.htnl FIXED'); });

//console.log(manifest);
fs.writeFile('./CHANGES/manifest.json', manifest, 'utf-8', function() { console.log('manifest.json FIXED'); });

//console.log(bower);
fs.writeFile('./CHANGES/bower.json', bower, 'utf-8', function() { console.log('bower.json FIXED'); });

//console.log(myApp);
fs.writeFile('./CHANGES/src/my-app.html', myApp, 'utf-8', function() { console.log('my-app.html FIXED'); });

var view =myView;
for(var i=0; i<config.sections.length; i++) {
    view =myView;
    view = view.replace(/return 'my-view1';/, "return '"+config.prefix+config.sections[i]+"';");
    view = view.replace(/MyView1/g, config.sectionClass[i]);
    view = view.replace(/id="my-view1"/g, 'id="'+config.prefix+config.sections[i]+'"');
    view = view.replace(/View One/, config.sectionsTitle[i]);

    //console.log(view);
    fs.writeFile('./CHANGES/src/'+config.prefix+config.sections[i]+'.html', view, 'utf-8', function() { console.log('section FIXED'); });
}

// MOVE OLD FILES
var dir = 'OLD';
if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
dir = 'OLD/src';
if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }

fs.renameSync('index.html', 'OLD/index.html');
fs.renameSync('manifest.json', 'OLD/manifest.json');
fs.renameSync('bower.json', 'OLD/bower.json');
fs.renameSync('src/my-app.html', 'OLD/src/my-view1.html');
fs.renameSync('src/my-view1.html', 'OLD/src/my-view1.html');
fs.renameSync('src/my-view2.html', 'OLD/src/my-view2.html');
fs.renameSync('src/my-view3.html', 'OLD/src/my-view3.html');

fs.renameSync('CHANGES/index.html', 'index.html');
fs.renameSync('CHANGES/manifest.json', 'manifest.json');
fs.renameSync('CHANGES/bower.json', 'bower.json');
fs.renameSync('CHANGES/src/my-app.html', 'src/my-app.html');
for(var i=0; i<config.sections.length; i++) {
    fs.renameSync('CHANGES/src/'+config.prefix+config.sections[i]+'.html', 'src/'+config.prefix+config.sections[i]+'.html');
}
//*/