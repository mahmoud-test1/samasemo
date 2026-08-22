(function(){
  "use strict";

  /* ---------- Hero title letter animation ---------- */
  var text = "Happy Birthday";
  var titleEl = document.getElementById('hero-title');
  var delay = 0;
  text.split("").forEach(function(ch){
    var span = document.createElement('span');
    if(ch === " "){
      span.className = "space";
    } else {
      span.className = "letter";
      span.textContent = ch;
      span.style.animationDelay = delay.toFixed(2) + "s";
      delay += 0.045;
    }
    titleEl.appendChild(span);
  });

  /* ---------- Balloons + sparkles ---------- */
  var landing = document.getElementById('landing');
  var balloonColors = ['#ff9fbe', '#ffc2d6', '#f3c66b', '#ffb0c9'];
  for(var i=0;i<7;i++){
    var b = document.createElement('div');
    b.className = 'balloon';
    var color = balloonColors[i % balloonColors.length];
    b.style.background = 'linear-gradient(160deg,' + color + ', #ffffffaa)';
    b.style.left = (5 + Math.random()*90) + '%';           // natural random spot
    b.style.animationDuration = (9 + Math.random()*6) + 's';
    b.style.animationDelay = (Math.random()*2.2) + 's';    // all appear within ~2s, no long wait
    b.style.width = (40 + Math.random()*22) + 'px';
    b.style.height = (54 + Math.random()*26) + 'px';
    landing.appendChild(b);
  }
  for(var j=0;j<22;j++){
    var s = document.createElement('div');
    s.className = 'sparkle';
    var size = 3 + Math.random()*4;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.animationDelay = (Math.random()*2.6) + 's';
    landing.appendChild(s);
  }

  /* ---------- Photos: load real image if present, else placeholder ---------- */
  document.querySelectorAll('.photo-card').forEach(function(card){
    var src = card.getAttribute('data-src');
    var img = new Image();
    img.onload = function(){
      var tag = document.createElement('img');
      tag.src = src;
      tag.alt = 'Yasmin memory photo';
      card.appendChild(tag);
    };
    img.onerror = function(){
      var ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.innerHTML = '<span class="heart">🤍</span><span>Add ' + src + '<br>next to this file</span>';
      card.appendChild(ph);
    };
    img.src = src;
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('.photo-card');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealTargets.forEach(function(t){ io.observe(t); });
  } else {
    revealTargets.forEach(function(t){ t.classList.add('in-view'); });
  }

  /* ---------- Envelope open ---------- */
  var envelope = document.getElementById('envelope');
  var arabicCard = document.getElementById('arabic-card');

  function burst(x, y){
    var emojis = ['🌸','✨','💗','🎀'];
    for(var k=0;k<10;k++){
      var p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      p.style.position = 'fixed';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.fontSize = (14 + Math.random()*10) + 'px';
      p.style.pointerEvents = 'none';
      p.style.zIndex = 999;
      p.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
      document.body.appendChild(p);
      var angle = Math.random()*Math.PI*2;
      var dist = 60 + Math.random()*80;
      requestAnimationFrame(function(){
        p.style.transform = 'translate(' + Math.cos(angle)*dist + 'px,' + (Math.sin(angle)*dist - 40) + 'px) scale(1.2)';
        p.style.opacity = '0';
      });
      setTimeout(function(el){ return function(){ el.remove(); }; }(p), 1050);
    }
  }

  var nameReveal = document.getElementById('name-reveal');

  envelope.addEventListener('click', function(){
    if(envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    var rect = envelope.getBoundingClientRect();
    burst(rect.left + rect.width/2, rect.top + 40);
    setTimeout(function(){
      arabicCard.classList.add('show');
      arabicCard.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 500);
    setTimeout(function(){
      nameReveal.classList.add('show');
    }, 1300);
  });

  /* ---------- Name button -> reveal personal video ---------- */
  var nameBtn = document.getElementById('name-btn');
  var videoSection = document.getElementById('video-section');
  var video = document.getElementById('birthday-video');
  var videoPlaceholder = document.getElementById('video-placeholder');

  video.addEventListener('loadeddata', function(){
    video.classList.add('ready');
    videoPlaceholder.classList.add('hide');
  });
  video.addEventListener('error', function(){
    video.classList.remove('ready');
    videoPlaceholder.classList.remove('hide');
  });

  nameBtn.addEventListener('click', function(){
    nameReveal.classList.add('opened');
    videoSection.classList.add('show');
    video.load();
    videoSection.scrollIntoView({ behavior:'smooth', block:'center' });
    video.play().catch(function(){ /* needs a tap on the video itself, that's fine */ });
  });

  /* ================= MUSIC (hidden local video, audio only) ================= */
  // Put a video file named "music.mp4" (or "music.webm") next to this
  // page. The video stays hidden — only its sound plays, on loop, in
  // the background. Nothing happens (no errors) until you add the file.
  var music = document.getElementById('bg-music');
  var fab = document.getElementById('music-fab');
  var soundEnabled = false;

  music.play().catch(function(){ /* will retry once metadata loads */ });

  function enableSound(){
    if(soundEnabled) return;
    soundEnabled = true;
    music.muted = false;
    music.play().catch(function(){});
  }

  // Browsers block sound before any interaction, so the track starts
  // muted automatically and switches to full sound the very first time
  // the visitor touches the page in any way (scroll, tap, click, key).
  ['scroll','click','touchstart','keydown'].forEach(function(evt){
    window.addEventListener(evt, enableSound, { once:true, passive:true });
  });

  music.addEventListener('play', function(){ fab.classList.add('spinning'); fab.title = 'الموزيك شغالة – دوسي للإيقاف'; });
  music.addEventListener('pause', function(){ fab.classList.remove('spinning'); fab.title = 'دوسي لتشغيل الموزيك'; });

  fab.addEventListener('click', function(){
    if(!soundEnabled){ enableSound(); return; }
    if(music.paused) music.play().catch(function(){});
    else music.pause();
  });

  /* ---------- Sticker placeholders: load real image if present, else placeholder (added) ---------- */
  document.querySelectorAll('.sticker').forEach(function(sticker){
    var src = sticker.getAttribute('data-src');
    if(!src) return;
    var img = new Image();
    img.onload = function(){
      var tag = document.createElement('img');
      tag.src = src;
      tag.alt = 'sticker';
      sticker.appendChild(tag);
    };
    img.onerror = function(){
      var ph = document.createElement('div');
      ph.className = 'sticker-placeholder';
      ph.innerHTML = '<span>✨</span>';
      sticker.appendChild(ph);
    };
    img.src = src;
  });

  /* ---------- Birthday pop: confetti/sparkle/ribbon burst + sticker reveal (added) ---------- */
  var stickersWrap = document.getElementById('letter-stickers-wrap');
  var burstStage = document.getElementById('burst-stage');
  var stickerRow = document.getElementById('sticker-row');
  var stickerLeftEl = document.getElementById('sticker-left');
  var stickerRightEl = document.getElementById('sticker-right');
  var birthdayPopFired = false;

  function spawnBirthdayBurst(stage, count){
    if(!stage) return;
    count = count || 28;
    var colors = ['#ff9fbe', '#ffc2d6', '#f3c66b', '#ffb0c9', '#e0537c', '#c9a6ff', '#8fd9c4'];
    var glyphs = ['🎉', '✨', '🎊', '🎀', '💗', '🌟'];
    for(var i = 0; i < count; i++){
      var p = document.createElement('div');
      p.className = 'burst-particle';
      var useGlyph = Math.random() < 0.5;
      if(useGlyph){
        p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        p.style.fontSize = (12 + Math.random() * 14) + 'px';
      } else {
        var w = 6 + Math.random() * 9;
        var h = 6 + Math.random() * 14;
        p.style.width = w + 'px';
        p.style.height = h + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
      }
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 150;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 30;
      var rot = (Math.random() * 720 - 360) + 'deg';
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', rot);
      p.style.left = (40 + Math.random() * 20) + '%';
      p.style.top = (30 + Math.random() * 20) + '%';
      p.style.animationDelay = (Math.random() * 0.18) + 's';
      stage.appendChild(p);
      (function(el){
        setTimeout(function(){ el.remove(); }, 1600);
      })(p);
    }
  }

  /* Makes one sticker glide to the middle of the row and grow, like it's
     being handed over, then glide back to its spot. Calls done() after. */
  function presentSticker(el, done){
    if(!el || !stickerRow){ if(done) done(); return; }
    var rowRect = stickerRow.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    var dx = (rowRect.left + rowRect.width / 2) - (elRect.left + elRect.width / 2);
    el.style.setProperty('--presentX', dx + 'px');
    el.classList.add('presenting');
    setTimeout(function(){ spawnBirthdayBurst(burstStage, 10); }, 700);
    var finished = false;
    function onEnd(){
      if(finished) return;
      finished = true;
      el.classList.remove('presenting');
      el.removeEventListener('animationend', onEnd);
      if(done) done();
    }
    el.addEventListener('animationend', onEnd);
    setTimeout(onEnd, 1900); // safety fallback in case animationend doesn't fire
  }

  envelope.addEventListener('click', function(){
    if(birthdayPopFired) return;
    birthdayPopFired = true;
    setTimeout(function(){
      spawnBirthdayBurst(burstStage);
      if(stickersWrap){ stickersWrap.classList.add('show'); }
      setTimeout(function(){
        presentSticker(stickerLeftEl, function(){
          setTimeout(function(){ presentSticker(stickerRightEl); }, 300);
        });
      }, 1000);
    }, 520);
  });

})();
/* ================= FLOATING CHAT -> TELEGRAM (added) ================= */
(function(){
  "use strict";

  // ⚠️ ضعي بيانات البوت هنا فقط
  var TELEGRAM_BOT_TOKEN = "8923137250:AAHxJZ2WK0trlzlJuAimq68c4HnvRWedqXQ";
  var TELEGRAM_CHAT_ID   = "7008229527";

  var STORAGE_KEY   = "yb_chat_msg_sent"; // flag بسيط، مش بيخزن نص الرسالة
  var POLL_INTERVAL = 4000; // كل قد إيه نسأل تليجرام لو فيه رد جديد (بالميلي ثانية)

  var fab      = document.getElementById('chat-fab');
  var win      = document.getElementById('chat-window');
  var body     = document.getElementById('chat-body');
  var input    = document.getElementById('chat-input');
  var sendBtn  = document.getElementById('chat-send');
  var toast    = document.getElementById('chat-toast');
  var note     = document.getElementById('chat-note');

  if(!fab || !win) return;

  var apiBase      = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN;
  var lastUpdateId = null; // آخر Update ID اتعاملنا معاه، عشان منكررش رد قديم

  // لو الزائر بعت قبل كده، وريها رسالة تطمنها من غير ما نخزن نص الرسالة
  if(localStorage.getItem(STORAGE_KEY) === "1"){
    note.textContent = "تم إرسال رسالتك السابقة بنجاح، شكرًا لكِ 💌";
    note.style.display = "block";
  }

  fab.addEventListener('click', function(){
    win.classList.toggle('open');
    if(win.classList.contains('open')){
      input.focus();
      body.scrollTop = body.scrollHeight;
    }
  });

  function showToast(message, isError){
    toast.textContent = message;
    toast.className = isError ? "error" : "";
    requestAnimationFrame(function(){ toast.classList.add('show'); });
    setTimeout(function(){ toast.classList.remove('show'); }, 2600);
  }

  function setLoading(state){
    sendBtn.classList.toggle('loading', state);
    sendBtn.disabled = state;
    input.disabled = state;
  }

  // بيضيف فقاعة رسالة جوه الشات وتفضل ظاهرة طول ما الصفحة مفتوحة
  function appendMessage(text, type){
    var bubble = document.createElement('div');
    bubble.className = 'chat-msg ' + type;
    bubble.textContent = text;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  function sendMessage(){
    var text = input.value.trim();
    if(!text || sendBtn.disabled) return; // يمنع الضغط المتكرر

    setLoading(true);

    fetch(apiBase + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
    })
    .then(function(res){
      if(!res.ok) throw new Error("send failed");
      return res.json();
    })
    .then(function(){
      setLoading(false);
      input.value = "";
      localStorage.setItem(STORAGE_KEY, "1");
      appendMessage(text, "sent"); // تفضل ظاهرة جوه الشات
      showToast("تم إرسال رسالتك بنجاح ✓", false);
    })
    .catch(function(){
      setLoading(false);
      showToast("حصل خطأ، حاولي تاني ✕", true);
    });
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e){
    if(e.key === "Enter") sendMessage();
  });

  /* ---------- استقبال الردود من تليجرام (Polling) ---------- */
  // أول ما الصفحة تفتح، بنعرف آخر Update ID موجود عشان منعرضش رسايل قديمة
  function initPolling(){
    fetch(apiBase + "/getUpdates?offset=-1")
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.ok && data.result && data.result.length){
          lastUpdateId = data.result[data.result.length - 1].update_id;
        }
        setInterval(pollForReplies, POLL_INTERVAL);
      })
      .catch(function(){
        // لو فشل أول اتصال، جربي تاني بعد شوية
        setTimeout(initPolling, POLL_INTERVAL);
      });
  }

  function pollForReplies(){
    var url = apiBase + "/getUpdates";
    if(lastUpdateId !== null) url += "?offset=" + (lastUpdateId + 1);

    fetch(url)
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(!data.ok || !data.result) return;
        data.result.forEach(function(update){
          lastUpdateId = update.update_id;
          var msg = update.message;
          if(!msg) return;
          if(String(msg.chat.id) !== String(TELEGRAM_CHAT_ID)) return;

          if(msg.text){
            if(msg.text.indexOf("/") === 0) return; // تجاهل أوامر زي /start
            appendMessage(msg.text, "received");
            if(!win.classList.contains("open")){ fab.classList.add("has-new"); }
            return;
          }

          // رسالة صوتية أو ملف صوتي جاي من البوت (رد بصوت) (added)
          var voiceFile = msg.voice || msg.audio;
          if(voiceFile && voiceFile.file_id){
            fetch(apiBase + "/getFile?file_id=" + voiceFile.file_id)
              .then(function(r){ return r.json(); })
              .then(function(fileData){
                if(!fileData.ok) return;
                var fileUrl = "https://api.telegram.org/file/bot" + TELEGRAM_BOT_TOKEN + "/" + fileData.result.file_path;
                if(window.appendVoiceMessage){
                  window.appendVoiceMessage(fileUrl, "received");
                } else {
                  appendMessage("🎤 رسالة صوتية جديدة", "received");
                }
                if(!win.classList.contains("open")){ fab.classList.add("has-new"); }
              })
              .catch(function(){ /* هنجرب تاني في الدورة الجاية */ });
            return;
          }

          // صورة جاية من البوت (رد بصورة) (added)
          if(msg.photo && msg.photo.length){
            var biggest = msg.photo[msg.photo.length - 1]; // أعلى دقة موجودة
            fetch(apiBase + "/getFile?file_id=" + biggest.file_id)
              .then(function(r){ return r.json(); })
              .then(function(fileData){
                if(!fileData.ok) return;
                var fileUrl = "https://api.telegram.org/file/bot" + TELEGRAM_BOT_TOKEN + "/" + fileData.result.file_path;
                if(window.appendImageMessage){
                  window.appendImageMessage(fileUrl, "received");
                } else {
                  appendMessage("🖼️ صورة جديدة", "received");
                }
                if(!win.classList.contains("open")){ fab.classList.add("has-new"); }
              })
              .catch(function(){ /* هنجرب تاني في الدورة الجاية */ });
          }
        });
      })
      .catch(function(){ /* هنجرب تاني في الدورة الجاية */ });
  }

  // لو فتحت الشات، شيلي علامة "فيه جديد"
  fab.addEventListener('click', function(){
    fab.classList.remove("has-new");
  });

  initPolling();

})();

/* ================= CHAT: FULLSCREEN + KEYBOARD HANDLING ON MOBILE (added) ================= */
(function(){
  "use strict";

  var chatWin = document.getElementById('chat-window');
  var backBtn = document.getElementById('chat-back');
  if(!chatWin) return;

  var savedScrollY = 0;
  var isLocked = false;

  function isMobileFull(){
    return window.matchMedia('(max-width: 768px)').matches;
  }

  // بيثبت نافذة الشات بالظبط على القد وا المكان الحقيقي للشاشة الظاهرة
  // فعليًا (visualViewport)، عشان تفضل ثابتة مكانها حتى لو الصفحة اتحركت
  // تحتها أو الكيبورد فتح/قفل.
  function applyViewportRect(){
    if(!chatWin.classList.contains('open') || !isMobileFull()){
      chatWin.style.top = '';
      chatWin.style.bottom = '';
      chatWin.style.height = '';
      return;
    }
    var vv = window.visualViewport;
    chatWin.style.bottom = 'auto';
    if(vv){
      chatWin.style.top = vv.offsetTop + 'px';
      chatWin.style.height = vv.height + 'px';
    } else {
      chatWin.style.top = '0px';
      chatWin.style.height = window.innerHeight + 'px';
    }
  }

  // بيمنع الصفحة اللي ورا الشات إنها تتحرك خالص وهو مفتوح (بدل overflow:hidden
  // اللي مبيوقفش السحب باللمس في الموبايل)، وده اللي كان بيخلي الشات "يختفي"
  // لو الزائر سحب لفوق بالغلط.
  function lockBodyScroll(){
    if(isLocked) return;
    isLocked = true;
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-savedScrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBodyScroll(){
    if(!isLocked) return;
    isLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  function onChatStateChange(){
    applyViewportRect();
    if(chatWin.classList.contains('open') && isMobileFull()){
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }

  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', applyViewportRect);
    window.visualViewport.addEventListener('scroll', applyViewportRect);
  }
  window.addEventListener('resize', applyViewportRect);
  window.addEventListener('orientationchange', function(){ setTimeout(applyViewportRect, 300); });

  var mo = new MutationObserver(onChatStateChange);
  mo.observe(chatWin, { attributes:true, attributeFilter:['class'] });

  onChatStateChange();

  // زرار الرجوع: بيقفل الشات (مفيد جدًا لما الشات بياخد الشاشة كلها في الموبايل)
  if(backBtn){
    backBtn.addEventListener('click', function(){
      chatWin.classList.remove('open');
    });
  }
})();

/* ================= CHAT: VOICE RECORDING -> TELEGRAM (added) ================= */
(function(){
  "use strict";

  // ⚠️ نفس بيانات البوت المستخدمة في رسايل النص
  var TELEGRAM_BOT_TOKEN = "8923137250:AAHxJZ2WK0trlzlJuAimq68c4HnvRWedqXQ";
  var TELEGRAM_CHAT_ID   = "7008229527";
  var apiBase = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN;

  var micBtn        = document.getElementById('chat-mic');
  var inputRow      = document.getElementById('chat-input-row');
  var recordTimerEl = document.getElementById('chat-record-timer');
  var recordCancel  = document.getElementById('chat-record-cancel');
  var recordSend    = document.getElementById('chat-record-send');
  var chatBody      = document.getElementById('chat-body');
  var chatToast     = document.getElementById('chat-toast');

  // ---------- مشغل صوت شكله زي الواتس (خط صوتي + زرار تشغيل) (added) ----------
  // متاح لأي جزء تاني في الصفحة عن طريق window.createVoicePlayer
  function createVoicePlayer(url){
    var wrap = document.createElement('div');
    wrap.className = 'voice-player';

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'voice-play-btn';
    playBtn.setAttribute('aria-label', 'تشغيل الرسالة الصوتية');
    playBtn.textContent = '▶';

    var waveWrap = document.createElement('div');
    waveWrap.className = 'voice-wave';
    var barCount = 26;
    var bars = [];
    for(var i=0;i<barCount;i++){
      var bar = document.createElement('span');
      var h = 5 + Math.round(Math.abs(Math.sin(i * 1.9)) * 14 + Math.random() * 4);
      if(h < 4) h = 4;
      if(h > 22) h = 22;
      bar.style.height = h + 'px';
      waveWrap.appendChild(bar);
      bars.push(bar);
    }

    var timeEl = document.createElement('span');
    timeEl.className = 'voice-time';
    timeEl.textContent = '0:00';

    wrap.appendChild(playBtn);
    wrap.appendChild(waveWrap);
    wrap.appendChild(timeEl);

    var audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;

    function fmt(sec){
      if(!isFinite(sec) || sec < 0) sec = 0;
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    audio.addEventListener('loadedmetadata', function(){
      if(isFinite(audio.duration)) timeEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', function(){
      if(!isFinite(audio.duration) || audio.duration <= 0) return;
      var pct = audio.currentTime / audio.duration;
      var activeCount = Math.round(pct * barCount);
      bars.forEach(function(b, idx){
        b.classList.toggle('played', idx < activeCount);
      });
      timeEl.textContent = fmt(audio.duration - audio.currentTime);
    });
    audio.addEventListener('play', function(){ playBtn.textContent = '⏸'; });
    audio.addEventListener('pause', function(){ playBtn.textContent = '▶'; });
    audio.addEventListener('ended', function(){
      playBtn.textContent = '▶';
      bars.forEach(function(b){ b.classList.remove('played'); });
      timeEl.textContent = fmt(audio.duration);
    });

    playBtn.addEventListener('click', function(){
      if(audio.paused) audio.play().catch(function(){});
      else audio.pause();
    });
    waveWrap.addEventListener('click', function(e){
      if(!isFinite(audio.duration) || audio.duration <= 0) return;
      var rect = waveWrap.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = Math.max(0, Math.min(1, pct)) * audio.duration;
    });

    return wrap;
  }

  // بيضيف فقاعة رسالة صوتية جوه الشات (مرسلة أو مستقبَلة) وشكلها زي الواتس
  function appendVoiceMessage(url, type){
    if(!chatBody) return;
    var bubble = document.createElement('div');
    bubble.className = 'chat-msg ' + (type || 'sent') + ' chat-voice-msg';
    bubble.appendChild(createVoicePlayer(url));
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  window.appendVoiceMessage = appendVoiceMessage; // متاحة لكود استقبال ردود التليجرام

  if(!micBtn || !inputRow) return;

  var mediaRecorder = null;
  var audioChunks   = [];
  var recordStartTime = 0;
  var recordTimerInterval = null;
  var isRecording = false;
  var isCancelled = false;

  function showToast(message, isError){
    if(!chatToast) return;
    chatToast.textContent = message;
    chatToast.className = isError ? "error" : "";
    requestAnimationFrame(function(){ chatToast.classList.add('show'); });
    setTimeout(function(){ chatToast.classList.remove('show'); }, 2600);
  }

  function formatTimer(ms){
    var totalSec = Math.floor(ms / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // بيختار أفضل صيغة تسجيل متاحة في المتصفح، وبيحدد إزاي نبعتها
  // لتليجرام عشان تظهر كرسالة صوتية طبيعية (مش ملف عادي)
  function pickRecording(){
    var candidates = [
      { mime: 'audio/ogg;codecs=opus',  ext:'ogg', endpoint:'sendVoice', field:'voice' },
      { mime: 'audio/webm;codecs=opus', ext:'ogg', endpoint:'sendVoice', field:'voice' },
      { mime: 'audio/webm',             ext:'ogg', endpoint:'sendVoice', field:'voice' },
      { mime: 'audio/mp4',              ext:'m4a', endpoint:'sendAudio', field:'audio' }
    ];
    for(var i=0;i<candidates.length;i++){
      if(window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidates[i].mime)){
        return candidates[i];
      }
    }
    return null;
  }

  function startRecording(){
    if(isRecording) return;
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
      showToast('المتصفح ده مش بيدعم تسجيل الصوت', true);
      return;
    }
    var chosen = pickRecording();
    if(!chosen){
      showToast('صيغة التسجيل مش مدعومة على الجهاز ده', true);
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio:true })
      .then(function(stream){
        audioChunks = [];
        isCancelled = false;

        try{
          mediaRecorder = new MediaRecorder(stream, { mimeType: chosen.mime });
        }catch(e){
          mediaRecorder = new MediaRecorder(stream);
        }

        mediaRecorder.addEventListener('dataavailable', function(e){
          if(e.data && e.data.size > 0) audioChunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', function(){
          stream.getTracks().forEach(function(t){ t.stop(); });
          if(isCancelled){
            audioChunks = [];
            return;
          }
          var blob = new Blob(audioChunks, { type: chosen.mime });
          uploadVoice(blob, chosen);
        });

        mediaRecorder.start();
        isRecording = true;
        recordStartTime = Date.now();
        inputRow.classList.add('recording');
        recordTimerEl.textContent = '0:00';
        recordTimerInterval = setInterval(function(){
          recordTimerEl.textContent = formatTimer(Date.now() - recordStartTime);
        }, 250);
      })
      .catch(function(){
        showToast('محتاجين إذن الميكروفون عشان تسجلي 🎤', true);
      });
  }

  function stopRecording(cancel){
    if(!isRecording || !mediaRecorder) return;
    isCancelled = !!cancel;
    isRecording = false;
    clearInterval(recordTimerInterval);
    inputRow.classList.remove('recording');
    if(mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  }

  function uploadVoice(blob, chosen){
    showToast('جاري إرسال الرسالة الصوتية...', false);

    var formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append(chosen.field, blob, 'voice.' + chosen.ext);

    fetch(apiBase + '/' + chosen.endpoint, {
      method: 'POST',
      body: formData
    })
    .then(function(res){
      if(!res.ok) throw new Error('upload failed');
      return res.json();
    })
    .then(function(){
      appendVoiceMessage(URL.createObjectURL(blob), 'sent');
      showToast('تم إرسال الرسالة الصوتية بنجاح ✓', false);
    })
    .catch(function(){
      showToast('حصل خطأ في إرسال الصوت، حاولي تاني ✕', true);
    });
  }

  micBtn.addEventListener('click', function(){
    if(!isRecording) startRecording();
    else stopRecording(false);
  });
  if(recordCancel){ recordCancel.addEventListener('click', function(){ stopRecording(true); }); }
  if(recordSend){ recordSend.addEventListener('click', function(){ stopRecording(false); }); }

})();

/* ================= CHAT: SEND PHOTOS -> TELEGRAM (added) ================= */
(function(){
  "use strict";

  // ⚠️ نفس بيانات البوت المستخدمة في باقي الشات
  var TELEGRAM_BOT_TOKEN = "8923137250:AAHxJZ2WK0trlzlJuAimq68c4HnvRWedqXQ";
  var TELEGRAM_CHAT_ID   = "7008229527";
  var apiBase = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN;

  var attachBtn  = document.getElementById('chat-attach');
  var photoInput = document.getElementById('chat-photo-input');
  var chatBody   = document.getElementById('chat-body');
  var chatToast  = document.getElementById('chat-toast');
  var lightbox   = document.getElementById('chat-lightbox');
  var lightboxImg= document.getElementById('chat-lightbox-img');

  if(!attachBtn || !photoInput) return;

  function showToast(message, isError){
    if(!chatToast) return;
    chatToast.textContent = message;
    chatToast.className = isError ? "error" : "";
    requestAnimationFrame(function(){ chatToast.classList.add('show'); });
    setTimeout(function(){ chatToast.classList.remove('show'); }, 2600);
  }

  // بيضيف فقاعة صورة جوه الشات (مرسلة أو مستقبَلة)، وتقدري تضغطي عليها تكبر
  function appendImageMessage(url, type){
    if(!chatBody) return;
    var bubble = document.createElement('div');
    bubble.className = 'chat-msg ' + (type || 'sent') + ' chat-img-msg';

    var img = document.createElement('img');
    img.src = url;
    img.alt = 'صورة';
    img.loading = 'lazy';
    img.addEventListener('click', function(){
      if(!lightbox || !lightboxImg) return;
      lightboxImg.src = url;
      lightbox.classList.add('open');
    });
    bubble.appendChild(img);

    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  window.appendImageMessage = appendImageMessage; // متاحة لكود استقبال ردود التليجرام

  if(lightbox){
    lightbox.addEventListener('click', function(){
      lightbox.classList.remove('open');
      lightboxImg.src = '';
    });
  }

  function uploadPhoto(file){
    var localUrl = URL.createObjectURL(file);
    showToast('جاري إرسال الصورة...', false);

    var formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', file, file.name || 'photo.jpg');

    fetch(apiBase + '/sendPhoto', {
      method: 'POST',
      body: formData
    })
    .then(function(res){
      if(!res.ok) throw new Error('upload failed');
      return res.json();
    })
    .then(function(){
      appendImageMessage(localUrl, 'sent');
      showToast('تم إرسال الصورة بنجاح ✓', false);
    })
    .catch(function(){
      showToast('حصل خطأ في إرسال الصورة، حاولي تاني ✕', true);
    });
  }

  attachBtn.addEventListener('click', function(){
    photoInput.click();
  });

  photoInput.addEventListener('change', function(){
    var files = Array.prototype.slice.call(photoInput.files || []);
    files.forEach(function(file){
      if(file.type && file.type.indexOf('image/') === 0){
        uploadPhoto(file);
      }
    });
    photoInput.value = ''; // عشان تقدري تختاري نفس الصورة تاني لو حبيتي
  });

})();

/* ================= LOCK SCREEN ================= */
(function(){
  "use strict";
  var CODE_DAY = "55";
  var CODE_MONTH = "88";

  var lockScreen = document.getElementById('lock-screen');
  var form = document.getElementById('lock-form');
  var dayInput = document.getElementById('lock-day');
  var monthInput = document.getElementById('lock-month');
  var errorEl = document.getElementById('lock-error');
  var frame = document.querySelector('.lock-frame');
  if(!lockScreen || !form) return;

  function onlyDigits(el){
    el.value = el.value.replace(/[^0-9]/g,'').slice(0,2);
  }
  dayInput.addEventListener('input', function(){
    onlyDigits(dayInput);
    if(dayInput.value.length === 2) monthInput.focus();
  });
  monthInput.addEventListener('input', function(){ onlyDigits(monthInput); });

  function unlock(){
    document.body.classList.remove('is-locked');
    lockScreen.classList.add('lock-hidden');
    try{ sessionStorage.setItem('ys_unlocked', '1'); }catch(e){}
  }

  function fail(){
    errorEl.classList.add('show');
    if(frame){
      frame.classList.remove('lock-shake');
      void frame.offsetWidth;
      frame.classList.add('lock-shake');
    }
    monthInput.value = '';
    dayInput.value = '';
    dayInput.focus();
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(dayInput.value === CODE_DAY && monthInput.value === CODE_MONTH){
      unlock();
    } else {
      fail();
    }
  });

  try{
    if(sessionStorage.getItem('ys_unlocked') === '1'){
      unlock();
    }
  }catch(e){}
})();
