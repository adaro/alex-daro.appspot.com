// ---
// generated by coffee-script 1.9.0

"use strict";
angular.module("alex-daro", []);

angular.module('alex-daro'  ).factory('Vec', function() {
  var Vec;
  return Vec = (function() {
    function Vec(_at_x, _at_y, _at_z) {
      this.x = _at_x != null ? _at_x : 0;
      this.y = _at_y != null ? _at_y : 0;
      this.z = _at_z != null ? _at_z : 0;
    }

    Vec.prototype.copy = function() {
      return new Vec(this.x, this.y, this.z);
    };

    Vec.fromAngleDist = function(angle, dist) {
      return new Vec(dist * Math.cos(angle), dist * Math.sin(angle));
    };

    Vec.prototype.toAngle = function() {
      return Math.atan2(this.y, this.x);
    };

    Vec.prototype.mag = function() {
      return Math.sqrt(this.magSq());
    };

    Vec.prototype.magSq = function() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    };

    Vec.prototype.normalize = function() {
      this.div(this.mag());
      return this;
    };

    Vec.prototype.add = function(p) {
      this.x += p.x;
      this.y += p.y;
      this.z += p.z;
      return this;
    };

    Vec.prototype.sub = function(p) {
      this.x -= p.x;
      this.y -= p.y;
      this.z -= p.z;
      return this;
    };

    Vec.prototype.mult = function(n) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
      return this;
    };

    Vec.prototype.div = function(n) {
      this.x /= n;
      this.y /= n;
      this.z /= n;
      return this;
    };

    Vec.prototype.distToSq = function(v) {
      return this.copy().sub(this.pos).magSq();
    };

    Vec.randomInCylinder = function() {
      var angle, height, radius;
      radius = Math.random();
      height = Math.random() - 0.5;
      angle = Math.random() * Math.PI * 2;
      return new Vec(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    };

    Vec.random2d = function() {
      return new Vec(Math.random() - 0.5, Math.random() - 0.5).mult(2);
    };

    return Vec;

  })();
});

angular.module('alex-daro').factory('Node', function(Vec) {
  var Node;
  return Node = (function() {
    function Node() {
      this.MAX_LINK_LENGTH = 150;
      this.pos = new Vec;
      this.vel = new Vec;
      this.acc = new Vec;
      this.radius = 5;
      this.color = 'black';
      this.hoverState = 0;
      this.start = new Date();
      this.age = 0;
    }

    Node.prototype.getAge = function() {
      return new Date().getTime() - this.start;
    };

    Node.prototype.applyForces = function() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      return this.acc = new Vec;
    };

    Node.prototype.update = function() {
      this.age += 1;
      return this.applyForces();
    };

    Node.prototype.getDisplayRadius = function() {
      var r;
      r = this.radius;
      if (!this.active) {
        r += (this.hoverState || 0) * 10;
      }
      return r;
    };

    Node.prototype.render = function(ctx, color) {
      var r;
      if (color == null) {
        color = this.color;
      }
      if (!this.isOnscreen()) {
        return;
      }
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.beginPath();
      r = this.getDisplayRadius();
      ctx.arc(0, 0, r, 0, Math.PI * 2, true);
      ctx.fillStyle = color;
      ctx.globalAlpha = this.getDotAlpha();
      ctx.fill();
      ctx.closePath();
      return ctx.restore();
    };

    Node.prototype.isOnscreen = function() {
      if (window.innerWidth > 800) {
        return true;
      } else {
        return this.pos.y < 20;
      }
    };

    Node.prototype.getLineStart = function() {
      return new Vec(this.pos.x, this.pos.y);
    };

    Node.prototype.getLineEnd = function() {
      return new Vec(this.link.pos.x, this.link.pos.y);
    };

    Node.prototype.getDotAlpha = function() {
      return Math.min(1, this.age / 10);
    };

    Node.prototype.getLinkAlpha = function() {
      var distance;
      distance = this.pos.copy().sub(this.link.pos).mag();
      return Math.max(0, (this.MAX_LINK_LENGTH - distance) / this.MAX_LINK_LENGTH);
    };

    Node.prototype.renderLink = function(ctx, color) {
      if (color == null) {
        color = this.color;
      }
      if (this.link != null) {
        if (!(this.isOnscreen() || this.link.isOnscreen)) {
          return;
        }
        ctx.save();
        ctx.beginPath();
        this.doLinkPath(ctx);
        ctx.strokeStyle = color;
        ctx.globalAlpha = this.getLinkAlpha();
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.closePath();
        return ctx.restore();
      }
    };

    Node.prototype.doLinkPath = function(ctx) {
      var end, start;
      start = this.getLineStart();
      end = this.getLineEnd();
      ctx.moveTo(start.x, start.y);
      return ctx.lineTo(end.x, end.y);
    };

    Node.prototype.updateLink = function() {
      var _ref;
      if (((_ref = this.link) != null ? _ref.pos.copy().sub(this.pos).mag() : void 0) > this.MAX_LINK_LENGTH) {
        return this.killLink();
      }
    };

    Node.prototype.linkTo = function(node) {
      this.linkStartTime = new Date;
      return this.link = node;
    };

    Node.prototype.killLink = function() {
      return this.link = null;
    };

    return Node;

  })();
});



var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

angular.module('alex-daro').factory('ANIMATION_SCATTERED_LINES', function(Node, Vec) {
  var ANIMATION_SCATTERED_LINES, ScatteredLineNode;
  ScatteredLineNode = (function(_super) {
    __extends(ScatteredLineNode, _super);

    function ScatteredLineNode() {
      ScatteredLineNode.__super__.constructor.call(this);
      this.MAX_LINK_LENGTH = 1000;
      this.LINE_ANIMATION_TIME = 10000;
      this.color = "rgba(255, 152, 0, 1)";
      this.radius = this.targetRadius = 0;
      this.linkStartTime = new Date(new Date().getTime() - 30000 * Math.random());
      this.scale = Math.random();
    }

    ScatteredLineNode.prototype.update = function() {
      ScatteredLineNode.__super__.update.call(this);
      this.radius = 0.1 * this.targetRadius + 0.9 * this.radius;
      this.targetRadius *= 0.99;
      this.targetRadius = Math.max(0, this.targetRadius - 0.05);
      if (!this.linkAnimationActive()) {
        this.killLink();
      }
      if (this.link != null) {
        this.targetRadius = Math.min(4, this.targetRadius + 0.2);
        return this.link.targetRadius = Math.min(4, this.link.targetRadius + 0.2);
      }
    };

    ScatteredLineNode.prototype.linkTo = function(n) {
      if (this.linkAnimationActive()) {
        return;
      }
      return ScatteredLineNode.__super__.linkTo.call(this, n);
    };

    ScatteredLineNode.prototype.linkAnimationActive = function() {
      return new Date().getTime() - this.linkStartTime.getTime() < this.LINE_ANIMATION_TIME;
    };

    ScatteredLineNode.prototype.getLineStart = function() {
      var i;
      i = Math.max(0, Math.min(1, (new Date().getTime() - this.linkStartTime.getTime() - this.LINE_ANIMATION_TIME / 2) / (this.LINE_ANIMATION_TIME / 2)));
      return this.pos.copy().mult(1 - i).add(this.link.pos.copy().mult(i));
    };

    ScatteredLineNode.prototype.getLineEnd = function() {
      var i;
      i = Math.min(1, (new Date().getTime() - this.linkStartTime.getTime()) / (this.LINE_ANIMATION_TIME / 2));
      return this.pos.copy().mult(1 - i).add(this.link.pos.copy().mult(i));
    };

    ScatteredLineNode.prototype.render = function(ctx) {
      if (this.actuallyShowDot) {
        return ScatteredLineNode.__super__.render.call(this, ctx);
      }
    };

    return ScatteredLineNode;

  })(Node);
  return ANIMATION_SCATTERED_LINES = (function() {
    function ANIMATION_SCATTERED_LINES(_at_w, _at_h) {
      var i, node;
      this.w = _at_w;
      this.h = _at_h;
      this.nodes = [];
      this.grid = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 70; i = ++_i) {
          node = new ScatteredLineNode;
          node.pos = new Vec(Math.random() * 350 + 200, Math.random() * 250 + 100);
          if (Math.random() < 0.1) {
            node.pos = new Vec(100, -100);
          }
          if (Math.random() < 0.05) {
            node.pos = new Vec(140, 200);
          }
          node.actuallyShowDot = Math.random() < 0.1;
          this.nodes.push(node);
          _results.push(node);
        }
        return _results;
      }).call(this);
      this.randomize();
    }

    ANIMATION_SCATTERED_LINES.prototype.randomize = function() {
      var n;
      n = _.sample(this.nodes);
      return n.linkTo(_.sample(this.nodes));
    };

    ANIMATION_SCATTERED_LINES.prototype.update = function() {
      var AOE, dist, n, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.randomize();
      if (this.mousePos != null) {
        _ref = this.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          dist = n.pos.copy().sub(this.mousePos).mag();
          AOE = 60;
          n.targetRadius = Math.max(n.targetRadius, 18 * (AOE - dist) / AOE);
        }
      }
      _ref1 = this.nodes;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        n = _ref1[_j];
        _results.push(n.update());
      }
      return _results;
    };

    ANIMATION_SCATTERED_LINES.prototype.render = function(ctx) {
      var n, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        n.renderLink(ctx);
      }
      _ref1 = this.nodes;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        n = _ref1[_j];
        _results.push(n.render(ctx));
      }
      return _results;
    };

    ANIMATION_SCATTERED_LINES.prototype.onMouseMove = function(e) {
      return this.mousePos = new Vec(e.x, e.y);
    };

    return ANIMATION_SCATTERED_LINES;

  })();
});

// ---
// generated by coffee-script 1.9.0

angular.module('alex-daro').directive('adCanvas', function($injector, $document, $window, $parse) {
  return {
    link: function(scope, el, attrs) {
      var args, init, klassName, timer;
      timer = window.requestAnimationFrame || window.setTimeout;
      args = attrs.adCanvas.split(/\s+/);
      klassName = args[0];
      init = function(Animation) {
        var animation, canvas, clickHandler, containerEl, ctx, done, dpi, h, moveHandler, update, varAs, w;
        w = ~~attrs.w;
        h = ~~attrs.h;
        if (attrs.w === 'full') {
          w = window.innerWidth;
        }
        containerEl = angular.element(el[0].querySelector('.ad-canvas-container'));
        if (!containerEl.length) {
          containerEl = el;
        }
        animation = new Animation(w, h, el, scope);
        varAs = args[2];
        if (varAs != null) {
          $parse(varAs).assign(scope, animation);
        }
        canvas = document.createElement('canvas');
        canvas.style.width = w + "px";
        dpi = window.devicePixelRatio || 1;
        canvas.width = w * dpi;
        canvas.height = h * dpi;
        containerEl.append(canvas);
        clickHandler = function(e) {
          var box;
          box = canvas.getBoundingClientRect();
          if (typeof animation.onClick === "function") {
            animation.onClick({
              x: e.pageX - box.left - window.pageXOffset,
              y: e.pageY - box.top - window.pageYOffset
            }, e);
          }
        };
        moveHandler = function(e) {
          var box;
          box = canvas.getBoundingClientRect();
          if (typeof animation.onMouseMove === "function") {
            animation.onMouseMove({
              x: e.pageX - box.left - window.pageXOffset,
              y: e.pageY - box.top - window.pageYOffset
            }, e);
          }
        };
        $document.on('click', clickHandler);
        $document.on('mousemove', moveHandler);
        ctx = canvas.getContext('2d');
        ctx.scale(dpi, dpi);
        done = false;
        scope.$on('$destroy', function() {
          done = true;
          $document.off('click', clickHandler);
          return $document.off('mouseMove', moveHandler);
        });
        update = function() {
          var box, isVisible;
          if (done) {
            return;
          }
          box = containerEl[0].getBoundingClientRect();
          isVisible = !(box.top > window.innerHeight || box.bottom < 0);
          if (isVisible && !animation.dontUpdate) {
            if (!animation.noClear) {
              ctx.clearRect(0, 0, w, h);
            }
            animation.update();
            animation.render(ctx);
          }
          return timer(update);
        };
        return timer(update);
      };
      return $injector.invoke([klassName, init]);
    }
  };
});