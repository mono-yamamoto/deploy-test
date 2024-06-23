class DialogManager {
	constructor() {
		document.body.addEventListener("click", this.handleBodyClick);
	}

	removeAllOpenAttributes() {
		const dialogs = document.querySelectorAll("dialog");
		for (const dialog of dialogs) {
			if (dialog instanceof HTMLDialogElement && dialog.hasAttribute("open")) {
				dialog.close();
				dialog.removeAttribute("open");
			}
		}
	}

	trapFocus(dialog) {
		const focusableElements = dialog.querySelectorAll(
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
		);
		const firstFocusableElement = focusableElements[0];
		const lastFocusableElement = focusableElements[
			focusableElements.length - 1
		];

		dialog.addEventListener("keydown", (event) => {
			if (event.key !== "Tab") {
				return;
			}

			if (event.shiftKey) {
				/* shift + tab */ if (
					document.activeElement === firstFocusableElement
				) {
					lastFocusableElement.focus();
					event.preventDefault();
				}
			} /* tab */ else {
				if (document.activeElement === lastFocusableElement) {
					firstFocusableElement.focus();
					event.preventDefault();
				}
			}
		});
	}

	handleBodyClick = (event) => {
		const targetElement = event.target;

		// dialog開閉のトリガーボタンに対する処理
		const dialogOpenButton = targetElement.closest(
			"button[data-js-dialog]",
		);
		if (dialogOpenButton) {
			// `dataset.jsDialog` が `undefined` でないことを確認する
			const dialogId = dialogOpenButton.dataset.jsDialog;
			if (typeof dialogId === "string") {
				this.toggleDialog(dialogId);
			}
			return;
		}

		// dialog要素自体に対する処理
		if (targetElement.tagName === "DIALOG") {
			this.closeDialog(targetElement);
		}
	};

	toggleDialog(dialogId) {
		const modal = document.querySelector(
			`dialog[data-js-dialog="${dialogId}"]`,
		);
		if (modal) {
			if (modal.open) {
				this.closeDialog(modal);
			} else {
				// data-modal属性が"false"の場合はshow()を使用し、trapFocusは呼び出さない
				if (modal.dataset.modal === "false") {
					this.removeAllOpenAttributes();
					modal.show();
				} else {
					this.removeAllOpenAttributes();
					modal.showModal();
					this.trapFocus(modal);
				}
			}
		}
	}

	async closeDialog(dialog) {
		const closeEvent = new Event('dialogClose', { cancelable: true });
		dialog.dispatchEvent(closeEvent);

		if (!closeEvent.defaultPrevented) {
			dialog.classList.add("hide");

			// 0.5秒待機
			await new Promise(resolve => setTimeout(resolve, 600));

			dialog.close();
			dialog.classList.remove("hide");

			// ダイアログが閉じた後に実行する動作
			const closedEvent = new Event('dialogClosed');
			dialog.dispatchEvent(closedEvent);
		} else {
		}
	}
}

// インスタンス化してイベントリスナーを有効にする
// DOM変更を監視するためのMutationObserverを設定する関数
function setupDialogManagerObserver() {
	let dialogManager = new DialogManager();

	const observer = new MutationObserver((mutations, obs) => {
		// ここでDOMの変更を検知したときの処理を書く
		// 現在のDialogManagerインスタンスを再利用するか、必要に応じて新しいインスタンスを作成する
		if (!dialogManager) {
			dialogManager = new DialogManager();
		}
	});

	observer.observe(document.body, {
		childList: true, // 直接の子ノードの変更を監視
		subtree: true, // すべての子孫ノードの変更も監視
		attributes: false, // 属性の変更は監視しない（必要に応じてtrueに変更）
	});

	// 後で監視を停止するためにobserverを返す
	return observer;
}

// ページ読み込み時に実行
window.addEventListener("DOMContentLoaded", () => {
	setupDialogManagerObserver();
});

