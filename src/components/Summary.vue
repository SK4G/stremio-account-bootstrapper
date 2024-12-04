<template>
  <section id="features">
    <h2>What does it do?</h2>
    <p>
      Stremio Account Bootstrapper lets you set up your Stremio account with
      just a few clicks by bootstrapping a preset into your account. It's handy
      for newcomers, those who want a solid foundation to build their setup on,
      or to speed up the process of setting up new accounts for family members
      or friends.
    </p>
    <h2>Which addons does the preset include?</h2>
    <div class="row">
      <div class="col-2 text-center">
        <img src="/public/logos/torrentio.png" alt="Torrentio" />
        <p>Torrentio</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/comet.png" alt="Comet" />
        <p>Comet</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/jackettio.png" alt="Jackettio" />
        <p>Jackettio</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/mediafusion.png" alt="MediaFusion" />
        <p>MediaFusion</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/knightcrawler.png" alt="Knight Crawler" />
        <p>Knight Crawler</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/tpbplus.png" alt="ThePirateBay+" />
        <p>ThePirateBay+</p>
      </div>
    </div>
    <div class="row">
      <div class="col-2 text-center">
        <img src="/public/logos/stremify.png" alt="Stremify" />
        <p>Stremify</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/trakt.png" alt="Trakt TV" />
        <p>Trakt TV</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/tmdb.png" alt="TMDB" />
        <p>TMDB</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/kitsu.png" alt="Anime Kitsu" />
        <p>Anime Kitsu</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/cinemeta.png" alt="Cinemeta" />
        <p>Cinemeta</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/localfiles.png" alt="Local Files" />
        <p>Local Files</p>
      </div>
    </div>
    <div class="row">
      <div class="col-2 text-center">
        <img src="/public/logos/opensubtitles.png" alt="OpenSubtitles v3" />
        <p>OpenSubtitles v3</p>
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/opensubtitlespro.png" alt="OpenSubtitles Pro" />
        <p>OpenSubtitles Pro</p>
      </div>
    </div>
    <h2>Instructions</h2>
    <ol>
      <li>
        Log in using your Stremio credentials or get the Stremio Authkey
        <a href="#how">(?)</a>.
      </li>
      <li>
        Select your preferred language.<br />
        <i>
          The Factory option allows you to reset the account to the same state
          as a recently created one.</i>
      </li>
      <li>
        Select your debrid service and enter the API key (optional)
        <a href="#faq">(?)</a>.<br />
        If you choose not to include it, ⚠️
        <strong class="text-error">you will be torrenting</strong> ⚠️. Please
        review your country's policies on torrenting before proceeding.<br />
        <i>Please note that MediaFusion, KnightCrawler, and ThePirateBay+ are only available when NO key is provided,
          while Jackettio is available when a key IS provided.</i>
      </li>
      <li>
        Enter your RPDB key (optional)
        <a href="https://ratingposterdb.com/" target="_blank">(?)</a>.
      </li>
      <li>
        Customize the addons preset (optional). You have the option to remove or
        sort addons, and rename or delete the Trakt/Anime Kitsu catalogs.
      </li>
      <li>
        Once you have finished customizing, click "Sync to Stremio" to update
        your account.
      </li>
      <li>Go to Stremio settings to adjust your preferred language options.</li>
      <li>Enjoy your favorite movies and TV shows!</li>
    </ol>
    <p class="text-center">
      ⚠️ You will
      <strong class="text-error">wipe the existing setup</strong> and there's no
      current way to
      <strong class="text-error">restore the previous configuration</strong>. ⚠️
      <br />
      <strong>Use it at your own risk. No support is provided.</strong>
    </p>
    <p>
      <br />
      <i>Note: If you need to change the language or update the debrid API key
        after clicking "Load Preset Addons", you will need to reload the page
        and start over.</i>
    </p>
  </section>
</template>
