(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{365:function(t,s,a){"use strict";a.r(s);var e=a(42),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"指南"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#指南"}},[t._v("#")]),t._v(" 指南")]),t._v(" "),a("p",[a("strong",[t._v("注意：目前应用还处于测试阶段，可能会出现一些不可预料的问题，包括但不限于数据丢失、程序崩溃、浏览器卡死等问题，请不要储存重要数据！")])]),t._v(" "),a("p",[t._v("推荐使用 Docker Compose 进行部署。")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("下载仓库中的 "),a("code",[t._v("docker-compose.yml")]),t._v(" 文件到你自己的机器，最好选择一个单独的文件夹，因为应用的配置文件会存放在 "),a("code",[t._v("文件夹/configs/main.yml")]),t._v(" 中。")])]),t._v(" "),a("li",[a("p",[t._v("新建 "),a("code",[t._v("main.yml")]),t._v(" 文件，放在 "),a("code",[t._v("文件夹/configs/main.yml")]),t._v(" ，内容如下。")]),t._v(" "),a("div",{staticClass:"language-yml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("server")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("jwt-secret")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("file")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" golang\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("admin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" password\n\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("admin")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("password")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1234")]),t._v("\n")])])]),a("p",[t._v("详细配置请查看文档 "),a("a",{attrs:{href:"https://lifeni.github.io/i-show-you/config/",target:"_blank",rel:"noopener noreferrer"}},[t._v("配置 | I Show You"),a("OutboundLink")],1),t._v(" 。")])]),t._v(" "),a("li",[a("p",[t._v("在文件夹下执行下面的命令启动容器。")]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[t._v("docker-compose up -d\n")])])]),a("p",[a("code",[t._v("-d")]),t._v(" 命令代表后台执行，去掉可以查看实时输出。")]),t._v(" "),a("blockquote",[a("p",[t._v("注意：应用默认暴露 8080 端口，如果出现端口冲突，或者你想使用自己的 MongoDB，可以自行修改 yml 文件。")])])])]),t._v(" "),a("p",[t._v("// TODO")])])}),[],!1,null,null,null);s.default=n.exports}}]);