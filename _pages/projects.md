---
layout: page
title: Projects
permalink: /projects/
description: Sponsored research and industry projects.
nav: true
nav_order: 4
---

{% comment %}
  This page is generated from the "projects" list in assets/json/resume.json,
  the same list shown on the CV page, so add or edit projects there.
  Projects are grouped by today's date (at the time the site is built):
  ongoing, upcoming (start date in the future) and completed (end date passed).
  A name ending in " - Co-PI" is shown with a Co-PI badge.
{% endcomment %}

{% assign today = site.time | date: "%Y-%m-%d" %}
{% assign projects = site.data.resume.projects | sort: "startDate" | reverse %}

{% assign groups = "Ongoing,Upcoming,Completed" | split: "," %}
{% for group in groups %}
  {% assign shown = 0 %}
  {% for p in projects %}
    {% if p.startDate > today %}{% assign status = "Upcoming" %}
    {% elsif p.endDate and p.endDate < today %}{% assign status = "Completed" %}
    {% else %}{% assign status = "Ongoing" %}{% endif %}
    {% if status == group %}
      {% if shown == 0 %}
<h2 class="mt-5">{{ group }}</h2>
      {% endif %}
      {% assign shown = shown | plus: 1 %}
      {% assign title = p.name %}
      {% assign co_pi = false %}
      {% if title contains " - Co-PI" %}
        {% assign co_pi = true %}
        {% assign title = title | remove: " - Co-PI" %}
      {% endif %}
<div class="card mt-3 p-3">
  <h5 class="card-title font-weight-bold mb-1">
    {{ title }}
    {% if co_pi %}<span class="badge badge-secondary align-middle ml-1" style="font-size: 0.7rem">Co-PI</span>{% endif %}
  </h5>
  <p class="mb-2">
    <span class="badge font-weight-bold danger-color-dark text-uppercase align-middle">
      {{ p.startDate | date: "%b %Y" }} – {% if p.endDate %}{{ p.endDate | date: "%b %Y" }}{% else %}Present{% endif %}
    </span>
  </p>
  <p class="card-text mb-2">{{ p.summary }}</p>
  {% if p.highlights %}
  <p class="mb-0">
    {% for h in p.highlights %}<span class="badge badge-pill badge-light border mr-1 mb-1 font-weight-normal" style="font-size: 0.8rem">{{ h }}</span>{% endfor %}
  </p>
  {% endif %}
</div>
    {% endif %}
  {% endfor %}
{% endfor %}
