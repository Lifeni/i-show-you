(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{365:function(e,s,t){"use strict";t.r(s);var a=t(42),n=Object(a.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"指南"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#指南"}},[e._v("#")]),e._v(" 指南")]),e._v(" "),t("p",[e._v("推荐使用 Docker Compose 进行部署。")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("下载仓库中的 "),t("code",[e._v("docker-compose.yml")]),e._v(" 文件到你自己的机器，最好选择一个单独的文件夹，因为应用的配置文件会存放在 "),t("code",[e._v("文件夹/configs/main.yml")]),e._v(" 中。")])]),e._v(" "),t("li",[t("p",[e._v("新建 "),t("code",[e._v("main.yml")]),e._v(" 文件，放在 "),t("code",[e._v("文件夹/configs/main.yml")]),e._v(" ，内容如下。")]),e._v(" "),t("div",{staticClass:"language-yml extra-class"},[t("pre",{pre:!0,attrs:{class:"language-yml"}},[t("code",[t("span",{pre:!0,attrs:{class:"token key atrule"}},[e._v("server")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[e._v("jwt-secret")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[e._v("file")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" golang\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[e._v("admin")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" password\n")])])]),t("p",[t("code",[e._v("server.jwt-secret.file")]),e._v(" 为文件创建者的 JWT 加密秘钥，用于验证文件的创建者（只有创建者才可以修改文件）。")]),e._v(" "),t("p",[t("code",[e._v("server.jwt-secert.admin")]),e._v(" 为后台管理页面的 JWT 加密秘钥，用于验证管理员权限。")])]),e._v(" "),t("li",[t("p",[e._v("在文件夹下执行下面的命令启动容器。")]),e._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[e._v("docker-compose up -d\n")])])]),t("p",[t("code",[e._v("-d")]),e._v(" 命令代表后台执行，去掉可以查看实时输出。")]),e._v(" "),t("blockquote",[t("p",[e._v("注意：应用默认暴露 8080 端口，如果出现端口冲突，或者你想使用自己的 MongoDB，可以自行修改 yml 文件。")])])])]),e._v(" "),t("p",[e._v("// TODO")])])}),[],!1,null,null,null);s.default=n.exports}}]);