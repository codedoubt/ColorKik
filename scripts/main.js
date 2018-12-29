var $ = function (e) {
	if (e[0] === "#")
		return document.getElementById(e.slice(1));
	else if (e[0] === '.')
		return document.getElementsByClassName(e.slice(1));
	else
		return document.getElementsByTagName(e);
}
var log = console.log;

function showImages(value) {
	if ((event.key == 'Enter' || event.keyCode == 13) && /\S+/ig.test(value)) {
		addPhotos(value);
	}
}
//https://api.pexels.com/v1/curated?per_page=15&page=1
addPhotos('wonder');

function addPhotos(value) {
	if (/\S+/.test(value)) {
		const newValue = encodeURI(value);
		const output = $('#output');
		output.innerHTML = '';
		const page = Math.floor(Math.random() * 10 + 1);
		const URL = `https://api.pexels.com/v1/search?query=${newValue}&per_page=40&page=${page}&mode=nocors`;
		const http = new XMLHttpRequest();
		http.open('GET', URL, true);
		http.onload = function () {
			const data = JSON.parse(http.responseText);
			const array = data.photos;
			output.innerHTML = "";
			for (let i = 0; i < array.length; i++) {
				const src = array[i].src.medium;
				const ph = array[i].photographer;
				const pURL = array[i].photographer_url;
				const id = array[i].id;
				const cc = new ColorCube();
				const palette = cc.getPalette(src, 6, updateOutput);

				function updateOutput(p) {
					const c1 = rgbToHex(p[0]);
					const c2 = rgbToHex(p[1]);
					const c3 = rgbToHex(p[2]);
					const c4 = rgbToHex(p[3]);
					const c5 = rgbToHex(p[4]);
					createElement(output, id, src, ph, pURL, c1, c2, c3, c4, c5);

					const color = $('.color');
					const clipboard = new ClipboardJS(color);
					alerrt(clipboard, color);

					const like = $('button');
					for (var i = 0; i < like.length; i++) {
						like[i].addEventListener('click', saveColor);
					}
				}
			}

		}
		//if you are seeing this do not use this api
		//please get one for yourself from pexels.com
		//because they are free
		http.setRequestHeader('Authorization', '563492ad6f91700001000001b2a775b0751046dcb560923b9b52a0e0');
		http.send();
	}
}

function saveColor() {
	const id = this.getAttribute('data-id');
	if (this.classList.contains('btnLiked')) {
		this.classList.remove('btnLiked');
		this.childNodes[0].classList.remove('svgLiked');
		this.childNodes[1].nodeValue = 'Like';
		localStorage.removeItem(id);
	} else {
		this.classList += ' btnLiked';
		this.childNodes[0].classList += ' svgLiked';
		this.childNodes[1].nodeValue = 'Liked';
		const html = this.parentNode.parentNode.outerHTML;
		localStorage.setItem(id, html);
	}
}

function getAllColors() {
    const keys = (Object.keys(localStorage));
    return keys;
}

function alerrt(clipboard, color) {
	var clip = new ClipboardJS(color, {
		text: function (trigger) {
			return trigger.getAttribute('data-c');
		}
	});
	clip.on('success', function (e) {
		alertColor(e.text);
	});
}

function alertColor(color) {
	if ($('.showColor')[0].style.display != 'none')
		$('.showColor')[0].style.display = 'none';
	$('.showColor')[0].style.display = "";
	$('.showText')[0].style.background = color;
	$('.tip')[0].innerHTML = "";
	$('.tip')[0].innerHTML = color;
}

function closeTip() {
	$('.showColor')[0].style.display = "none";
}
//p = photographer
//pURL = photographerURL
function createElement(appendTo, id, img, p, pURL, c1, c2, c3, c4, c5) {
	const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const d = new Date();
	let elem = `<div class="color_palette"><div class="palette">				<div class="img"><img src="${img}" alt="Tyler">
					<div class="imgFoot">Shot by <a href="${pURL}">${p}</a></div></div><div class="colors"><div class="color" style="background:${c1}" data-c='${c1}'></div><div class="color" style="background:${c2}" data-c='${c2}'></div><div class="color" style="background:${c3}" data-c='${c3}'></div><div class="color" style="background:${c4}" data-c='${c4}'></div><div class="color" style="background:${c5}" data-c='${c5}'></div></div></div><div class="cFoot"><button data-id="${id}" class="like"><svg class="btn-svg" viewBox="0 0 400 874" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421">			<path d="M267.614 383.395l132.304 81.708L147.94 873.117l-15.636-383.395L0 408.014 251.979 0l15.635 383.395z"/></svg>Like</button><div id="date">	${d.getDate()} ${monthNames[d.getMonth()]},${d.getFullYear()}</div></div></div>`;
	return appendTo.insertAdjacentHTML('beforeend', elem);
}

function rgbToHex([r, g, b]) {
	return '#' + [r, g, b].map(function (x) {
		var hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}).join('');
}




window.addEventListener('resize', modifyHeader);
modifyHeader();

function modifyHeader() {
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight || e.clientHeight || g.clientHeight;
	var left = `<li><a href="/">Images</a></li>`;
	var right = `<li><a href="/likes/">Your Likes</a></li>
				<li><a href="/about/">About</a></li>`;
	if (x > 860) {
		$('.left')[0].innerHTML = '';
		$('.left')[0].insertAdjacentHTML('beforeend', left);
		$('.dropdown')[0].innerHTML = '';
		$('.dropdown')[0].insertAdjacentHTML('beforeend', right);

	} else {
		$('.left')[0].innerHTML = '';
		$('.dropdown')[0].innerHTML = '';
		$('.dropdown')[0].insertAdjacentHTML('afterbegin', left + right);
	}

	activateLink();

	function activateLink() {
		var links = $('header')[0].querySelectorAll('a');
		var hrefs = [];
		for (var a = 0; a < links.length; a++) {
			hrefs[hrefs.length] = links[a].href;
		}
		var path = window.location;
		for (var i = 0; i < links.length; i++) {
			links[i].className.replace('active', '');
			if (hrefs[i].toLowerCase() == path) {
				links[i].classList += "active";
			}
		}
	}
}



//the code below is colorcube.min.js
//you can find it at https://github.com/codedoubt/color-cube
var ImageCanvas = function (t) {
		this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.w = this.canvas.width = t.width, this.h = this.canvas.height = t.height, this.ctx.drawImage(t, 0, 0, this.w, this.h), document.body.appendChild(this.canvas), this.clear = function () {
			this.ctx.clearRect(0, 0, this.w, this.h)
		}, this.getPixels = function () {
			return this.w * this.h
		}, this.getImageData = function () {
			return this.ctx.getImageData(0, 0, this.w, this.h)
		}, this.remove = function () {
			this.canvas.parentNode.removeChild(this.canvas)
		}
	},
	ColorCube = function () {};
ColorCube.prototype.getPalette = function (t, e, a) {
	var i = a || function () {},
		n = e || 10,
		s = t,
		h = [],
		c = [],
		o = new Image;
	o.src = s, o.crossOrigin = "Anonymous", log(o), o.addEventListener("load", function () {
		for (var t = new ImageCanvas(o), e = t.getImageData().data, a = t.getPixels(), s = 0, r = 0, g = 0, u = 0, v = 0; v < a; v += 5) r = e[(s = 4 * v) + 0], g = e[s + 1], u = e[s + 2], e[s + 3], c[c.length] = [r, g, u];
		t.clear(), t.remove();
		var l = MMCQ.quantize(c, n);
		h = l ? l.palette() : null, i(h)
	})
};

/*
 * quantize.js Copyright 2008 Nick Rabinowitz
 * Ported to node.js by Olivier Lesnicki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

// fill out a couple protovis dependencies
/*
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (!pv) var pv = {
	map: function (r, n) {
		var o = {};
		return n ? r.map(function (r, t) {
			return o.index = t, n.call(o, r)
		}) : r.slice()
	},
	naturalOrder: function (r, n) {
		return r < n ? -1 : r > n ? 1 : 0
	},
	sum: function (r, n) {
		var o = {};
		return r.reduce(n ? function (r, t, u) {
			return o.index = u, r + n.call(o, t)
		} : function (r, n) {
			return r + n
		}, 0)
	},
	max: function (r, n) {
		return Math.max.apply(null, n ? pv.map(r, n) : r)
	}
};
var MMCQ = function () {
	var r = 5,
		n = 8 - r,
		o = 1e3;

	function t(n, o, t) {
		return (n << 2 * r) + (o << r) + t
	}

	function u(r) {
		var n = [],
			o = !1;

		function t() {
			n.sort(r), o = !0
		}
		return {
			push: function (r) {
				n.push(r), o = !1
			},
			peek: function (r) {
				return o || t(), void 0 === r && (r = n.length - 1), n[r]
			},
			pop: function () {
				return o || t(), n.pop()
			},
			size: function () {
				return n.length
			},
			map: function (r) {
				return n.map(r)
			},
			debug: function () {
				return o || t(), n
			}
		}
	}

	function e(r, n, o, t, u, e, i) {
		var c = this;
		c.r1 = r, c.r2 = n, c.g1 = o, c.g2 = t, c.b1 = u, c.b2 = e, c.histo = i
	}

	function i() {
		this.vboxes = new u(function (r, n) {
			return pv.naturalOrder(r.vbox.count() * r.vbox.volume(), n.vbox.count() * n.vbox.volume())
		})
	}

	function c(r, n) {
		if (n.count()) {
			var o = n.r2 - n.r1 + 1,
				u = n.g2 - n.g1 + 1,
				e = n.b2 - n.b1 + 1,
				i = pv.max([o, u, e]);
			if (1 == n.count()) return [n.copy()];
			var c, f, a, v, s = 0,
				p = [],
				l = [];
			if (i == o)
				for (c = n.r1; c <= n.r2; c++) {
					for (v = 0, f = n.g1; f <= n.g2; f++)
						for (a = n.b1; a <= n.b2; a++) v += r[t(c, f, a)] || 0;
					s += v, p[c] = s
				} else if (i == u)
					for (c = n.g1; c <= n.g2; c++) {
						for (v = 0, f = n.r1; f <= n.r2; f++)
							for (a = n.b1; a <= n.b2; a++) v += r[t(f, c, a)] || 0;
						s += v, p[c] = s
					} else
						for (c = n.b1; c <= n.b2; c++) {
							for (v = 0, f = n.r1; f <= n.r2; f++)
								for (a = n.g1; a <= n.g2; a++) v += r[t(f, a, c)] || 0;
							s += v, p[c] = s
						}
			return p.forEach(function (r, n) {
					l[n] = s - r
				}),
				function (r) {
					var o, t, u, e, i, f = r + "1",
						a = r + "2",
						v = 0;
					for (c = n[f]; c <= n[a]; c++)
						if (p[c] > s / 2) {
							for (u = n.copy(), e = n.copy(), i = (o = c - n[f]) <= (t = n[a] - c) ? Math.min(n[a] - 1, ~~(c + t / 2)) : Math.max(n[f], ~~(c - 1 - o / 2)); !p[i];) i++;
							for (v = l[i]; !v && p[i - 1];) v = l[--i];
							return u[a] = i, e[f] = u[a] + 1, [u, e]
						}
				}(i == o ? "r" : i == u ? "g" : "b")
		}
	}
	return e.prototype = {
		volume: function (r) {
			var n = this;
			return n._volume && !r || (n._volume = (n.r2 - n.r1 + 1) * (n.g2 - n.g1 + 1) * (n.b2 - n.b1 + 1)), n._volume
		},
		count: function (r) {
			var n = this,
				o = n.histo;
			if (!n._count_set || r) {
				var u, e, i, c = 0;
				for (u = n.r1; u <= n.r2; u++)
					for (e = n.g1; e <= n.g2; e++)
						for (i = n.b1; i <= n.b2; i++) c += o[t(u, e, i)] || 0;
				n._count = c, n._count_set = !0
			}
			return n._count
		},
		copy: function () {
			var r = this;
			return new e(r.r1, r.r2, r.g1, r.g2, r.b1, r.b2, r.histo)
		},
		avg: function (n) {
			var o = this,
				u = o.histo;
			if (!o._avg || n) {
				var e, i, c, f, a = 0,
					v = 1 << 8 - r,
					s = 0,
					p = 0,
					l = 0;
				for (i = o.r1; i <= o.r2; i++)
					for (c = o.g1; c <= o.g2; c++)
						for (f = o.b1; f <= o.b2; f++) a += e = u[t(i, c, f)] || 0, s += e * (i + .5) * v, p += e * (c + .5) * v, l += e * (f + .5) * v;
				o._avg = a ? [~~(s / a), ~~(p / a), ~~(l / a)] : [~~(v * (o.r1 + o.r2 + 1) / 2), ~~(v * (o.g1 + o.g2 + 1) / 2), ~~(v * (o.b1 + o.b2 + 1) / 2)]
			}
			return o._avg
		},
		contains: function (r) {
			var o = this,
				t = r[0] >> n;
			return gval = r[1] >> n, bval = r[2] >> n, t >= o.r1 && t <= o.r2 && gval >= o.g1 && gval <= o.g2 && bval >= o.b1 && bval <= o.b2
		}
	}, i.prototype = {
		push: function (r) {
			this.vboxes.push({
				vbox: r,
				color: r.avg()
			})
		},
		palette: function () {
			return this.vboxes.map(function (r) {
				return r.color
			})
		},
		size: function () {
			return this.vboxes.size()
		},
		map: function (r) {
			for (var n = this.vboxes, o = 0; o < n.size(); o++)
				if (n.peek(o).vbox.contains(r)) return n.peek(o).color;
			return this.nearest(r)
		},
		nearest: function (r) {
			for (var n, o, t, u = this.vboxes, e = 0; e < u.size(); e++)((o = Math.sqrt(Math.pow(r[0] - u.peek(e).color[0], 2) + Math.pow(r[1] - u.peek(e).color[1], 2) + Math.pow(r[2] - u.peek(e).color[2], 2))) < n || void 0 === n) && (n = o, t = u.peek(e).color);
			return t
		},
		forcebw: function () {
			var r = this.vboxes;
			r.sort(function (r, n) {
				return pv.naturalOrder(pv.sum(r.color), pv.sum(n.color))
			});
			var n = r[0].color;
			n[0] < 5 && n[1] < 5 && n[2] < 5 && (r[0].color = [0, 0, 0]);
			var o = r.length - 1,
				t = r[o].color;
			t[0] > 251 && t[1] > 251 && t[2] > 251 && (r[o].color = [255, 255, 255])
		}
	}, {
		quantize: function (f, a) {
			if (!f.length || a < 2 || a > 256) return !1;
			var v, s, p, l, h, b, g = (v = f, b = new Array(1 << 3 * r), v.forEach(function (r) {
				p = r[0] >> n, l = r[1] >> n, h = r[2] >> n, s = t(p, l, h), b[s] = (b[s] || 0) + 1
			}), b);
			g.forEach(function () {});
			var m, x, _, d, w, z, M, y, k, O, E = (m = g, w = 1e6, z = 0, M = 1e6, y = 0, k = 1e6, O = 0, f.forEach(function (r) {
					x = r[0] >> n, _ = r[1] >> n, d = r[2] >> n, x < w ? w = x : x > z && (z = x), _ < M ? M = _ : _ > y && (y = _), d < k ? k = d : d > O && (O = d)
				}), new e(w, z, M, y, k, O, m)),
				q = new u(function (r, n) {
					return pv.naturalOrder(r.count(), n.count())
				});

			function A(r, n) {
				for (var t, u = 1, e = 0; e < o;)
					if ((t = r.pop()).count()) {
						var i = c(g, t),
							f = i[0],
							a = i[1];
						if (!f) return;
						if (r.push(f), a && (r.push(a), u++), u >= n) return;
						if (e++ > o) return
					} else r.push(t), e++
			}
			q.push(E), A(q, .75 * a);
			for (var C = new u(function (r, n) {
					return pv.naturalOrder(r.count() * r.volume(), n.count() * n.volume())
				}); q.size();) C.push(q.pop());
			A(C, a - C.size());
			for (var Q = new i; C.size();) Q.push(C.pop());
			return Q
		}
	}
}();
