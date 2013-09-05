define([
	'jasmine',
	'streamhub-sdk/content/state-to-content'],
function (jasmine, StateToContent) {
	describe('streamhub-sdk/streams/transforms/state-to-content', function () {
		it('is a constructor', function () {
			expect(StateToContent).toEqual(jasmine.any(Function));
			expect(StateToContent.prototype).toEqual(jasmine.any(Object));
		});
		describe('StateToContent.transform(state, opts)', function () {
			var transform = StateToContent.transform;
			it('is a static method', function () {
				expect(transform).toEqual(jasmine.any(Function));
			});
		});
		describe('instance', function () {
			var stateToContent,
		        mockData;
			beforeEach(function () {
		        mockData = {"states":{"tweet-312328006913904641@twitter.com":{"vis":1,"content":{"replaces":"","bodyHtml":"<a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:14268796\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" href=\"https://twitter.com/#!/TheRoyalty\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">TheRoyalty</span></a> hoppin on a green frog after the set at <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:1240466234\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" href=\"https://twitter.com/#!/Horseshoe_SX13\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">Horseshoe_SX13</span></a> showcase during <a href=\"https://twitter.com/#!/search/realtime/%23sxsw\" class=\"fyre-hashtag\" hashtag=\"sxsw\" rel=\"tag\" target=\"_blank\">#sxsw</a> <a href=\"http://t.co/lUqA5TT7Uy\" target=\"_blank\" rel=\"nofollow\">pic.twitter.com/lUqA5TT7Uy</a>","annotations":{},"authorId":"190737922@twitter.com","parentId":"","updatedAt":1363299774,"id":"tweet-312328006913904641@twitter.com","createdAt":1363299774},"source":1,"lastVis":0,"type":0,"event":1363299777181024},"oem-3-tweet-312328006913904641@twitter.com":{"vis":1,"content":{"targetId":"tweet-312328006913904641@twitter.com","authorId":"-","link":"http://twitter.com/PlanetLA_Music/status/312328006913904641/photo/1","oembed":{"provider_url":"http://twitter.com","title":"Twitter / PlanetLA_Music: @TheRoyalty hoppin on a green ...","url":"","type":"rich","html":"<blockquote class=\"twitter-tweet\"><a href=\"https://twitter.com/PlanetLA_Music/status/312328006913904641\"></a></blockquote><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>","author_name":"","height":0,"thumbnail_width":568,"width":0,"version":"1.0","author_url":"","provider_name":"Twitter","thumbnail_url":"https://pbs.twimg.com/media/BFWcquJCUAA7orG.jpg","thumbnail_height":568},"position":3,"id":"oem-3-tweet-312328006913904641@twitter.com"},"source":1,"lastVis":0,"type":3,"event":1363299777193595}},"authors":{"190737922@twitter.com":{"displayName":"PlanetLA_Music","tags":[],"profileUrl":"https://twitter.com/#!/PlanetLA_Music","avatar":"http://a0.twimg.com/profile_images/1123786999/PLAnew-logo_normal.jpg","type":3,"id":"190737922@twitter.com"}},"jsver":"10026","maxEventId":1363299777193595};
				StateToContent.Storage.cache = {};
				stateToContent = new StateToContent({ authors: mockData.authors });
			});
			it('is instanceof StateToContent', function () {
				expect(stateToContent instanceof StateToContent).toBe(true);
			});
			it('uses author information passed on construction as opts.authors', function () {
				var state = mockData.states["tweet-312328006913904641@twitter.com"],
					content = stateToContent.transform(state);
				expect(content.author.id).toBe(state.content.authorId);
				expect(content.author.displayName).toBe('PlanetLA_Music');
			});
			it ("should handle child attachments if received out of order", function () {
                var parent = mockData.states["tweet-312328006913904641@twitter.com"];
                var child = mockData.states["oem-3-tweet-312328006913904641@twitter.com"];
                var childContent = stateToContent.transform(child);
                var parentContent = stateToContent.transform(parent);
                expect(childContent).not.toBeDefined();
                expect(parentContent).toBeDefined();
                expect(parentContent.attachments.length).toBe(1);
            });
		});
	});
});