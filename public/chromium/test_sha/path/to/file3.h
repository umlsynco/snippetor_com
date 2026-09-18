// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef WEBLAYER_BROWSER_WEBLAYER_BROWSER_CONTEXT_H_
#define WEBLAYER_BROWSER_WEBLAYER_BROWSER_CONTEXT_H_

#include <memory>

#include "content/public/browser/browser_context.h"

namespace weblayer {

class ProfileImpl;

// WebLayerBrowserContext adapts a ProfileImpl to the content-layer
// BrowserContext interface, backing cookies, cache and storage.
class WebLayerBrowserContext : public content::BrowserContext {
 public:
  explicit WebLayerBrowserContext(ProfileImpl* profile);
  ~WebLayerBrowserContext() override;

  // content::BrowserContext implementation:
  base::FilePath GetPath() override;
  bool IsOffTheRecord() override;

 private:
  ProfileImpl* profile_;
};

}  // namespace weblayer

#endif  // WEBLAYER_BROWSER_WEBLAYER_BROWSER_CONTEXT_H_
