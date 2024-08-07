!(function () {
  function e() {
    var e,
      t = this.$$;
    (this.commands = linux_commands || []),
      (this.elm_query = t("query")),
      (this.elm_btn = t("search_btn")),
      (this.elm_result = t("result")),
      (this.elm_search_result = t("search_list_result")),
      (this.root_path =
        ((t = t("current_path")),
          (e = window.location.origin + window.location.pathname),
          t ? e.replace(/\/(c\/)?(\w|-)+\.html/, "").replace(/\/$/, "") : "")),
      (this.query = ""),
      (this.query_size = 5),
      (this.page_size = 50),
      this.init(),
      this.goToIndex();
  }
  (e.prototype = {
    $$: function (e) {
      return document.getElementById(e);
    },
    goToIndex: function () {
      for (var e = document.getElementsByTagName("A"), t = 0; t < e.length; t++)
        "/" !== e[t].pathname ||
          /^https?:/i.test(e[t].protocol) ||
          (e[t].href = this.root_path + "/");
    },
    bindEvent: function (e, t, n) {
      e.addEventListener
        ? e.addEventListener(t, n, !1)
        : e.attachEvent && e.attachEvent("on" + t, n);
    },
    isSreachIndexOF: function (e, t) {
      return e && t ? e.toLowerCase().indexOf(t.toLowerCase()) : -1;
    },
    getQueryString: function (e) {
      (e = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i")),
        (e = decodeURIComponent(
          window.location.hash.replace(/^(\#\!|\#)/, "")
        ).match(e));
      return null != e ? unescape(e[2]) : null;
    },
    pushState: function () {
      window.history &&
        window.history.pushState &&
        (this.query
          ? history.pushState({}, "linux_commands", "#!kw=" + this.query)
          : history.pushState({}, "linux_commands", window.location.pathname));
    },
    simple: function (e, t) {
      return e.replace(/\$\w+\$/gi, function (e) {
        e = t[e.replace(/\$/g, "")];
        return void 0 === e ? "" : e;
      });
    },
    createKeyworldsHTML: function (e, t, n) {
      var s = e.n,
        r = e.d,
        i = new RegExp("(" + t + ")", "ig"),
        t =
          (t &&
            ((s = e.n.replace(i, '<i class="kw">$1</i>')),
              (r = e.d.replace(i, '<i class="kw">$1</i>') || "")),
            this.root_path.replace(/\/$/, ""));
      return this.simple(
        n
          ? '<a href="' +
          t +
          '/c$url$.html"><strong>$name$</strong> - $des$</a><p></p>'
          : '<a href="' +
          t +
          '/c$url$.html"><strong>$name$</strong> - $des$</a>',
        { name: s, url: e.p, des: r }
      );
    },
    searchResult: function (e) {
      var t = this.commands,
        n = this,
        s = 0,
        r = t.length,
        i = [],
        l = [],
        u = e ? this.page_size : this.query_size,
        a = [],
        o = [];
      if (t && t.length && -1 < toString.call(t).indexOf("Array"))
        for (; s < r && t[s]; s++) {
          var c,
            h = n.isSreachIndexOF(t[s].n, n.query),
            d = n.isSreachIndexOF(t[s].d, n.query);
          -1 < h
            ? (((c = t[s]).nIdx = h), a.push(c))
            : -1 < d && (((c = t[s]).dIdx = d), o.push(c));
        }
      for (
        a.sort(function (e, t) {
          return e.nIdx - t.nIdx;
        }),
        o.sort(function (e, t) {
          return e.nIdx - t.nIdx;
        }),
        l = (l = a.concat(o)).slice(0, u),
        s = 0;
        s < l.length;
        s++
      )
        i.push(n.createKeyworldsHTML(l[s], n.query, e));
      var m = e ? this.elm_search_result : this.elm_result;
      m.innerHTML = "";
      for (var p, s = 0; s < i.length; s++)
        ((p = document.createElement("LI")).innerHTML = i[s]), m.appendChild(p);
      0 === i.length &&
        (((p = document.createElement("LI")).innerHTML =
          (this.query, "请尝试输入一些字符，进行搜索！</span>")),
          m.appendChild(p));
    },
    selectedResult: function (e) {
      for (var t = this.elm_result.children, n = 0, s = 0; s < t.length; s++)
        if ("ok" == t[s].className) {
          (t[s].className = ""), (n = "up" == e ? s - 1 : s + 1);
          break;
        }
      t[n] && (t[n].className = "ok");
    },
    isSelectedResult: function () {
      for (var e = this.elm_result.children, t = !1, n = 0; n < e.length; n++)
        if ("ok" == e[n].className) {
          t = e[n];
          break;
        }
      return t;
    },
    init: function () {
      var n = this,
        e = n.getQueryString("kw");
      (this.elm_query.value = e),
        (this.query = e || ""),
        this.elm_search_result && n.searchResult(!0),
        this.bindEvent(this.elm_query, "input", function (e) {
          (n.query = e.target.value),
            n.pushState(),
            n.query ? n.searchResult() : (n.elm_result.style.display = "none"),
            n.elm_search_result
              ? n.elm_btn.click()
              : (n.elm_result.style.display = n.query ? "block" : "none");
        }),
        this.bindEvent(this.elm_btn, "click", function (e) {
          (n.elm_result.style.display = "none"),
            n.elm_search_result
              ? n.searchResult(!0)
              : (window.location.href =
                n.root_path + "/list.html#!kw=" + n.query);
        }),
        this.bindEvent(this.elm_query, "focus", function (e) {
          n.searchResult(), n.query && (n.elm_result.style.display = "block");
        }),
        this.bindEvent(this.elm_query, "blur", function (e) {
          setTimeout(function () {
            n.elm_result.style.display = "none";
          }, 300);
        }),
        this.bindEvent(document, "keyup", function (e) {
          if ("Enter" == e.key) {
            var t = n.isSelectedResult();
            if (!t) return n.elm_btn.click();
            t.children[0] && t.children[0].click();
          } else 40 === e.keyCode ? n.selectedResult() : 38 === e.keyCode && n.selectedResult("up");
        }),
        e && n.searchResult();
    },
  }),
    new e();
})();
