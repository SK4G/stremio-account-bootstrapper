<template>
  <section id="features">
    <h2>What does it do?</h2>
    <p>
      Stremio Account Bootstrapper lets you set up your Stremio account with
      just a few clicks by bootstrapping a preset into your account. It's handy
      for newcomers or to speed up the process of setting up new accounts for
      family members or friends.
    </p>
    <h2>Which addons does the preset include?</h2>
    <div class="row">
      <div class="col-2 text-center">
        <img src="/public/logos/trakt.png" alt="Trakt TV" /> Trakt TV
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/torrentio.png" alt="Torrentio" /> Torrentio
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/comet.png" alt="Comet" /> Comet
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/stremify.png" alt="Stremify" /> Stremify
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/tmdb.png" alt="TMDB" /> TMDB
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/kitsu.png" alt="Anime Kitsu" /> Anime Kitsu
      </div>
    </div>
    <div class="row">
      <div class="col-2 text-center">
        <img src="/public/logos/opensubtitles.png" alt="OpenSubtitles v3" />
        OpenSubtitlesv3
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/cinemeta.png" alt="Cinemeta" /> Cinemeta
      </div>
      <div class="col-2 text-center">
        <img src="/public/logos/localfiles.png" alt="Local Files" /> Local Files
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
          as a recently created one.</i
        >
      </li>
      <li>
        Enter your RealDebrid API key (optional).<br />
        If you choose not to include it, ⚠️
        <strong class="text-error">you will be torrenting</strong> ⚠️. Please
        review your country's policies on torrenting before proceeding.
        <i>Note that Comet is only available when a key is provided.</i>
      </li>
      <li>
        Customize the preset addons (optional). You have the option to remove
        addons and either rename or delete the Trakt/Anime Kitsu catalogs.
      </li>
      <li>
        Once you have finished customizing, click "Sync to Stremio" to update
        your account.
      </li>
      <li>
        Go to the Stremio settings to adjust your preferred language options.
      </li>
      <li>Enjoy your favorite movies and TV shows!</li>
    </ol>
    <p class="text-center">
      ⚠️ You will
      <strong class="text-error">wipe the existing setup</strong> and there's no
      current way to
      <strong class="text-error">restore the previous configuration</strong>. ⚠️
      <br />
      <strong>Use it at your own risk.</strong>
    </p>
    <p>
      <br />
      <i
        >Note: If you need to change the language or update the RealDebrid API
        key after clicking "Load Preset Addons", you will need to reload the
        page and start over.</i
      >
    </p>
  </section>
</template>
